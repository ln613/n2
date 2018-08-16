const fs = require('fs');
const mongodb = require('mongodb');
const cd = require('cloudinary');
const { sortWith, ascend, descend, prop, fromPairs, merge } = require('ramda');
const { tap, config, json2js, adjustRating, newRating } = require('./utils');
const moment = require('moment');

const allDocs = ['cats', 'players', 'products', 'tournaments'];

let db = null;
if (config) cd.config({ cloud_name: 'vttc', api_key: config.cloudinary_key, api_secret: config.cloudinary_secret });
const e = {};

e.initdb = mongoURL => {
  if (db || mongoURL == null) return;

  mongodb.connect(mongoURL).then(conn => {
    db = conn;
    console.log('Connected to MongoDB at: %s', mongoURL);
  });
};

e.initdocs = docs => {
  const f = k => r => db.collection(k).insertMany(docs[k]);
  return Promise.all(
    Object.keys(docs).map(k => db.collection(k).drop().then(f(k)).catch(f(k)))
  );
}

e.initdata = () => e.initdocs(json2js(fs.readFileSync('./data/db.json')))

e.initacc = () => e.initdocs(json2js(fs.readFileSync('./data/1.json')))

e.bak = () => Promise.all(allDocs.map(e.get)).then(l => fromPairs(l.map((d, i) => [allDocs[i], d])))//.then(x => JSON.stringify(x)).then(x => { fs.writeFile('./data/db.json', x); return x; })

e.fix = () => db.collection('tournaments').findOne({ id: 86 }).then(t => {
  t.games.forEach(g => {
    g.p1 = +g.p1;
    g.p2 = +g.p2;
    if (g.isDouble) {
      g.p3 = +g.p3;
      g.p4 = +g.p4;
    }
  });
  return db.collection('tournaments').save(t);
});

e.list = () => Object.keys(db)

e.count = doc => db.collection(doc).count()

e.get = doc => db.collection(doc).find({}, { _id: 0 }).toArray()

e.getIdName = doc => db.collection(doc).find({}, { _id: 0, id: 1, name: 1 }).toArray()

e.getIdName = doc => db.collection(doc).find({}, { _id: 0, id: 1, name: 1 }).toArray()

e.getById = (doc, id) => db.collection(doc).findOne({ id: +id }, { _id: 0 })

e.search = (doc, prop, val, fields) => db.collection(doc).find(
    (prop || prop === '_') ? {} : { [prop]: isNaN(+val) ? new RegExp(val, 'i') : +val},
    merge({ _id: 0, id: 1, name: 1 }, fields ? fromPairs(fields.split(',').map(x => [x, 1])) : {})
).toArray()

e.add = (doc, obj) => db.collection(doc).insert(obj);

e.replace = (doc, obj) => db.collection(doc).replaceOne({ id: obj.id }, obj)

e.addToList = (doc, id, list, obj) => db.collection(doc).update({ id: +id }, { $addToSet: { [list]: obj } })

e.replaceList = (doc, id, list, obj) => db.collection(doc).update({ id: +id, [list + '.id']: obj.id }, { $set: { [list + '.$']:obj } })

e.update = (doc, obj) => db.collection(doc).update({ id: obj.id }, { $set: obj })

e.delete = (doc, obj) => db.collection(doc).remove({ id: obj.id })

e.drop = doc => db.collection(doc).drop()

e.cdList = () => cd.v2.api.resources({ max_results: 500 }).then(r => sortWith([ascend(prop('public_id'))], r.resources))

e.cdVersion = () => cd.v2.api.resources({ max_results: 500 }).then(r => sortWith([descend(prop('version'))], r.resources)[0].version)

e.getPlayerGames = id => db.collection('tournaments').aggregate([
  { $unwind: '$games' },
  { $match: { $or: [ { 'games.p1': +id }, { 'games.p2': +id } ], 'games.isDouble': { $ne: true }, isSingle: { $ne: true } } },
  { $project: { games: 1, _id: 0, name: 1 } }
]).toArray().then(r => r.map(x => ({name: x.name, games: x.games, pid: id})))

e.getPlayerRating = (id, date) => db.collection('tournaments').aggregate([
  { $unwind: '$games' },
  { $match: { $or: [ { 'games.p1': id }, { 'games.p2': id } ] } },
  { $match: { 'games.date': { $lte: date === '_' ? new Date() : new Date(date) } } },
  { $sort: { 'games.date': -1, 'games.id': -1 } },
  { $limit: 1 },
  { $replaceRoot: { newRoot: '$games'} },
  { $project: { rating: { $cond: [{ $eq: ['$p1', id] }, { $add: ['$p1Rating', '$p1Diff'] }, { $add: ['$p2Rating', '$p2Diff'] }] } } }
]).toArray().then(x => x[0].rating)

e.changeResult = g1 => db.collection('tournaments').aggregate([
  { $unwind: '$games' },
  { $match: { 'games.id': { $gte: g1.id }, 'games.isDouble': { $ne: true }, isSingle: { $ne: true } } },
  { $sort: { 'games.id': 1 } },
  { $project: { games: 1, _id: 0, id: 1 } }
]).toArray().then(ts => {
  const ps = [[g1.p1, g1.p1Rating], [g1.p2, g1.p2Rating]];
  const pp = ts.map(t => {
    let g = t.games;
    if (g.id === g1.id) g.result = g1.result;
    let p1 = ps.find(p => p[0] === g.p1);
    let p2 = ps.find(p => p[0] === g.p2);
    if (p1 || p2) {
      if (p1) g.p1Rating = p1[1];
      else ps.push(p1 = [g.p1, g.p1Rating]);
      if (p2) g.p2Rating = p2[1];
      else ps.push(p2 = [g.p2, g.p2Rating]);
      g = adjustRating(g);
      p1[1] = newRating(g.p1Rating, g.p1Diff);
      p2[1] = newRating(g.p2Rating, g.p2Diff);
      return db.collection('tournaments').update({ id: t.id, 'games.id': g.id }, { $set: { 'games.$.p1Rating': g.p1Rating, 'games.$.p1Diff': g.p1Diff, 'games.$.p2Rating': g.p2Rating, 'games.$.p2Diff': g.p2Diff, 'games.$.result': g.result } });
    } else {
      return null;
    }
  }).filter(p => p);
  return Promise.all(pp)
    .then(_ => Promise.all(ps.map(p => db.collection('players').update({ id: p[0] }, { $set: {rating: p[1]}}))));
}).catch(e => console.log(e))

module.exports = e;
