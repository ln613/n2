const MongoClient = require('mongodb').MongoClient;
const cd = require('cloudinary');
const { sortWith, ascend, descend, prop, fromPairs, toPairs, merge, filter, map, unnest, pipe, find, findIndex, isNil, last, pick, groupBy, zipWith, mergeDeepWith, is, concat, range, uniq, slice, flatten } = require('ramda');
const { tap, httpGet, json2js, adjustRating, newRating, serial, toDateOnly, rrSchedule, rrScheduleTeam, group, sortTeam, gengames } = require('.');
const moment = require('moment');
const { findById, split2, getNameById, use, sortBy } = require('@ln613/util');

cd.config({ cloud_name: 'vttc', api_key: process.env.CLOUDINARY_KEY, api_secret: process.env.CLOUDINARY_SECRET });

const allDocs = ['categories', 'players', 'products', 'tournaments'];
let db = null;
const e = {};

e.connectDB = async () => db || (db = await MongoClient.connect(tap(process.env.DB_LOCAL || process.env.DB)).then(x => x.db()));

e.initdocs = docs => {
  const f = k => r => db.collection(k).insertMany(docs[k]);
  return Promise.all(
    Object.keys(docs).map(k => db.collection(k).drop().then(f(k)).catch(f(k)))
  );
}

e.initdata = async d => e.initdocs(d || await httpGet(`${process.env.GITHUB_DB}db.json`))

e.backup = () => Promise.all(allDocs.map(e.get)).then(l => fromPairs(l.map((d, i) => [allDocs[i], d])))

e.list = () => Object.keys(db)

e.count = doc => db.collection(doc).count()

e.get = doc => db.collection(doc).find().project({ _id: 0 }).toArray()

e.getIdName = doc => db.collection(doc).find().project({ _id: 0, id: 1, name: 1 }).toArray()

e.getById = (doc, id) => db.collection(doc).findOne({ id: +id }, { projection: { _id: 0 }})

e.search = (doc, prop, val, fields) => db.collection(doc)
  .find(prop ? { [prop]: isNaN(+val) ? new RegExp(val, 'i') : +val } : {})
  .project(merge({ _id: 0, id: 1, name: 1 }, fields ? fromPairs(fields.split(',').map(x => [x, 1])) : {}))
  .toArray()

e.add = (doc, obj) => db.collection(doc).insert(obj);

e.replace = (doc, obj) => db.collection(doc).replaceOne({ id: obj.id }, obj)

e.addToList = (doc, id, list, obj) => db.collection(doc).update({ id: +id }, { $addToSet: { [list]: obj } })

e.replaceList = (doc, id, list, obj) => db.collection(doc).update({ id: +id, [list + '.id']: obj.id }, { $set: { [list + '.$']:obj } })

e.clearList = (doc, id, list) => db.collection(doc).update({ id: +id }, { $set: { [list]: [] } })

e.update = (doc, obj) => db.collection(doc).update({ id: obj.id }, { $set: obj })

e.delete = (doc, obj) => db.collection(doc).remove({ id: obj.id })

e.drop = doc => db.collection(doc).drop()

e.cdList = () => cd.v2.api.resources({ max_results: 500 }).then(r => sortWith([ascend(prop('public_id'))], r.resources))

e.cdVersion = () => cd.v2.api.resources({ max_results: 500 }).then(r => sortWith([descend(prop('version'))], r.resources)[0].version)

e.cdupload = ({ url, folder, name }) => cd.v2.uploader.upload(url, { public_id: folder + '/' + name, use_filename: true, unique_filename: false, overwrite: true })

e.getPlayerGames = id => db.collection('tournaments').aggregate([
  { $unwind: '$games' },
  { $match: { $or: [ { 'games.p1': +id }, { 'games.p2': +id } ], 'games.isDouble': { $ne: true }, isSingle: { $ne: true } } },
  { $project: { games: 1, _id: 0, name: 1, startTime: 1 } }
]).toArray().then(r => r.map(x => ({name: x.name, games: x.games, pid: id, startTime: x.startTime})))

e.getPlayerRating = (id, date) => use(
  toDateOnly(moment().add(-1, 'M').startOf('month')),
  toDateOnly(moment().add(-1, 'M').endOf('month'))
)((d1, d2) =>
  db.collection('tournaments').aggregate([
    { $unwind: '$games' },
    { $match: { $or: [ { 'games.p1': +id }, { 'games.p2': +id }, { 'games.p1': id.toString() }, { 'games.p2': id.toString() } ] } },
    { $match: { 'games.date': { $gte: d1, $lte: d2 } } },
    { $sort: { 'games.date': -1, 'games.id': -1 } },
    { $replaceRoot: { newRoot: '$games'} },
    { $project: { rating: { $cond: [{ $or: [{ $eq: ['$p1', id.toString()] }, { $eq: ['$p1', +id] }] }, { $add: ['$p1Rating', '$p1Diff'] }, { $add: ['$p2Rating', '$p2Diff'] }] } } }
  ]).toArray()
).then(x => x.filter(y => y.rating)).then(x => x.length === 0 ? e.getById('players', id) : sortBy('rating', x)[0]).then(x => (x || {}).rating)

e.changeResult = g1 => db.collection('tournaments').aggregate([
  { $unwind: '$games' },
  { $match: { 'games.date': { $gte: new Date(g1.date) }, 'games.isDouble': { $ne: true }, isSingle: { $ne: true } } },
  { $sort: { 'games.date': 1 } },
  { $project: { games: 1, _id: 0, id: 1 } }
]).toArray().then(ts => {
  const ps =   [[g1.p1, g1.p1Rating], [g1.p2, g1.p2Rating]];
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

e.updateRating = async body => {
  const pr = body || await httpGet(`${process.env.GITHUB_DB}initialRatings.json`);

  return await e.backup().then(o => {
    o.players.forEach(p => p.sex = p.sex && p.sex.length > 0 ? p.sex.slice(0, 1).toUpperCase(): '');
    
    o.tournaments.filter(t => t.id !== 146).forEach(t => {
      if (t.startDate) t.startDate = toDateOnly(t.startDate);
      if (t.startDate2) t.startDate2 = toDateOnly(t.startDate2);
    });

    unnest(o.tournaments.map(t => t.schedules)).forEach(s => {
      if (s && s.date) s.date = toDateOnly(s.date);
    });

    const games = pipe(
      filter(t => !t.isSingle),
      map(t => t.games.map(g => g)),
      map(t => {
        (t.games || []).forEach(g => {
          g.round = isNil(g.group)
            ? null
            : find(
                m => m.home == g.t1 && m.away == g.t2,
                find(s => s.group == g.group, t.schedules).matches
              ).round
        })
        return t.games.map(g => [g, { tournament: t.name, startTime: t.startTime }]);
      }),
      flatten,
      filter(g => !g.isDouble),
      sortWith([
        ascend(([g, x]) => new Date(toDateOnly(g.date))),
        ascend(([g, x]) => x.startTime || Number.POSITIVE_INFINITY),
        ascend(([g, x]) => x.tournament),
        ascend(([g, x]) => (g.group && +g.group) || Number.POSITIVE_INFINITY),
        ascend(([g, x]) => (g.round && +g.round) || Number.POSITIVE_INFINITY),
        descend(([g, x]) => (g.ko && +g.ko) || 0),
        ascend(([g, x]) => g.id)
      ])
      // x => x.slice(25000)
    )(o.tournaments);

    games.forEach(([g, x], i) => {
      if (g) {
        g.id = i + 1;
        g.date = toDateOnly(g.date);
        if (!g.isDouble) {
          if (pr[g.p1]) g.p1Rating = pr[g.p1];
          if (pr[g.p2]) g.p2Rating = pr[g.p2];
          adjustRating(g, false);
          pr[g.p1] = newRating(g.p1Rating, g.p1Diff);
          pr[g.p2] = newRating(g.p2Rating, g.p2Diff);
          if (isNil(g.round)) delete g.round;
        }
      }
    });

    Object.keys(pr).forEach(p => findById(p)(o.players).rating = +pr[p]);

    return e.initdata(o).then(() => 'done');

    // return games;
  })
  .catch(e => tap(e));
}

e.getNewGameId = () => db.collection('tournaments').aggregate([
  { $project: { _id: 0, id: { $max: "$games.id" } } },
  { $sort: { id: -1 } },
  { $limit: 1 }
]).toArray().then(x => x[0].id)

e.genrr = body => {
  const id = +body.id;
  const tables = body.tables;
  const standing = body.standing;
  const koStanding = body.koStanding || [];

  return e.getById('tournaments', id).then(t => {
    if (t.isSingle) {
      if (t.players && !t.schedules) {
        const s = rrSchedule(t.players, true);
        return e.update('tournaments', {
          id,
          schedules: s.map((x, i) => ({ id: i + 1, matches: x, date: toDateOnly(moment(t.startDate).add(i, 'week').toDate()) }))
        }).then(_ => s);
      } else {
        return 'N/A';
      }
    } else {
      if (t.teams && t.teams.length > 0 && !isNil(t.teams[0].group)) { // teams are grouped
        const groups = groupBy(x => x.group, t.teams);
        const hasKO = find(s => s.ko, t.schedules || []);
        const hasKOStanding = find(s => s.ko === koStanding.length, t.schedules || []);
        if (!t.schedules) {
          const schedules = Object.keys(groups).map(g => ({
            matches: pipe(l => rrSchedule(l, false, true), unnest, map(x => ({ ...x, games: gengames(t, x.home, x.away) })))(groups[g]),
            date: t.startDate,
            group: g,
            id: +g
          }));
          return e.update('tournaments', { id, schedules }).then(_ => schedules);
        } else if ((standing && !hasKO) || hasKOStanding) {
          const matches = (hasKOStanding ?
            range(0, koStanding.length / 2).map((n, i) => ({ home: koStanding[n], away: koStanding[koStanding.length - n - 1], id: i + 1 })) :
            unnest(range(0, standing.length / 2).map((n, i) => [
              { home: standing[n][0].id, away: standing[standing.length - n - 1][1].id, id: i * 2 + 1 },
              { home: standing[n][1].id, away: standing[standing.length - n - 1][0].id, id: i * 2 + 2 }
            ]))
          ).map(x => ({ ...x, games: gengames(t, x.home, x.away) }));
          const schedules = [...t.schedules, { date: t.startDate, ko: hasKOStanding ? koStanding.length / 2 : standing.length, matches, id: t.schedules.length + 1 }];
          return e.update('tournaments', { id, schedules }).then(_ => schedules);
        } else {
          return 'N/A';
        }
      } else if (!t.has2half && t.teams && t.schedules && standing) { // generate schedule for 2nd half, already has schedule and current standing is sent
        const sd = t.startDate2 || toDateOnly(moment(last(t.schedules).date).add(3, 'week').toDate());
        const tt = split2(t.isCeil)(standing.map(x => find(y => y.name === x.team, t.teams)));
        const s1 = rrScheduleTeam(tap(tt)[0], sd, tables ? tables[0] : [5, 6, 7]);
        const s2 = rrScheduleTeam(tt[1], sd, tables ? tables[1] : [1, 2, 3]);
        const s = zipWith(mergeDeepWith((a, b) => is(Array, a) ? concat(a, b) : a))(s1, s2);
        const lastId = last(t.schedules).id;
        return e.update('tournaments', {
          id,
          startDate2: sd,
          has2half: true,
          teams: t.teams.map(x => ({...x, rank: find(y => y.team === x.name, standing).rank })),
          schedules: concat(t.schedules, s.map(x => ({ ...x, id: lastId + x.id, half: true })))
        }).then(_ => s);
      } else if (t.teams && !t.schedules) {
        const s = rrScheduleTeam(t.teams, t.startDate, tables);
        return e.update('tournaments', { id, schedules: s }).then(_ => s);
      } else {
        return 'N/A';
      }
    }
  });
}

e.gengroup = id => e.getById('tournaments', id).then(t => {
  if (!t.isSingle && t.teams && t.teams.length > 0 && isNil(t.teams[0].group) && isNil(t.games) && isNil(t.schedules)) { // teams are not yet grouped, no games and no schedules
    const teams = group(sortTeam(t.teams, t.p3));
    return e.update('tournaments', { id, teams }).then(_ => teams);
  } else {
    return 'N/A';
  }
});

e.changePlayer = (tid, p1, p2) => e.getById('tournaments', tid).then(t => e.get('players').then(ps => {
  if (t.isSingle && ps.find(x => x.id == p1) && ps.find(x => x.id == p2) && t.players.find(x => x.id == p1) && !t.players.find(x => x.id == p2)) {
    const ms = unnest(t.schedules.map(s => s.matches.filter(m => m.home == p1 || m.away == p1)));
    if (ms.every(m => !m.result)) {
      const tplayers = sortWith([descend(x => +x.rating)], t.players);
      const p = ps.find(x => x.id == p2);
      const tp = tplayers.find(x => x.id == p1);
      const tpi = tplayers.findIndex(x => x.id == p1) + 1;
      tp.id = +p2;
      tp.rating = p.rating;
      ms.forEach(m => {
        if (m.home == p1) {
          m.home = +p2;
          m.player1 = `${tpi}. ${p.firstName} ${p.lastName} (${p.rating})`;
        }
        if (m.away == p1) {
          m.away = +p2;
          m.player2 = `${tpi}. ${p.firstName} ${p.lastName} (${p.rating})`;
        }
      })
      e.replace('tournaments', t)
      return 'done'
    }
  }
  return 'N/A';
}));

e.nogame = body => {
  const id = +body.id;
  const date = body.date;
  const weeks = +(body.weeks || '1');
  return e.getById('tournaments', id).then(t => {
    if (t.schedules) {
      const n = findIndex(s => s.date === date, t.schedules);
      if (n === -1) {
        return 'N/A';
      } else {
        const schedules = t.schedules.map((s, i) => i >= n ? {...s, date: toDateOnly(moment(s.date).add(weeks, 'week').toDate())} : s);
        return e.update('tournaments', { id, schedules }).then(_ => schedules);
      }
    } else {
      return 'N/A';
    }
  });
};

e.resetTeams = body => {
  const id = +body.id;
  return e.getById('tournaments', id).then(t => {
    if (t.teams) {
      const teams = t.teams.map(x => ({...x, group: null }));
      return e.update('tournaments', { id, teams, schedules: null, games: null });
    } else {
      return 'N/A';
    }
  });
};

e.groupmatch = (id, grp, body) => e.getById('tournaments', id).then(t => {
  if (t.schedules) {
    const games = body.games.filter(g => g.result && g.result !== '0:0');
    const group = getUniqProp('group', games);
    const ko = getUniqProp('ko', games);
    const t1 = getUniqProp('t1', games);
    const t2 = getUniqProp('t2', games);
    const isSingleTournament = t.teams.every(x => x.players.length === 1);
    const isOldGroup = g => g.group && g.group == group && (isSingleTournament || (g.t1 === t1 && g.t2 == t2));
    const isOldKO = g => g.ko && g.ko == ko && (isSingleTournament || (g.t1 === t1 && g.t2 == t2));
    const newGames = (t.games || []).filter(g => !isOldGroup(g) && !isOldKO(g));
    return e.clearList('tournaments', +id, 'games').then(r => serial(newGames.concat(games), g => e.addToList('tournaments', +id, 'games', g)));
  } else {
    return 'N/A';
  }
});

e.getDetail = id => e.getById('tournaments', id).then(t => e.get('players').then(ps => {
  return {
    name: t.name,
    schedules: t.schedules.map(s => `${s.id}, ${s.date}, ${s.matches.map(m => `${m.home} ${getNameById(m.home)(t.teams)} - ${m.away} ${getNameById(m.away)(t.teams)}`).join(', ')}`),
    games: t.games.map((g, i) => `${i}, ${g.id}, ${g.date}, ${g.t1} ${getNameById(g.t1)(t.teams)} - ${g.t2} ${getNameById(g.t2)(t.teams)}, ${g.p1} ${getNameById(g.p1)(ps)} - ${g.p2} ${getNameById(g.p2)(ps)}`)
  };
}));

module.exports = e;

const getUniqProp = (p, l) => {
  const ps = uniq(l.map(x => x[p]).filter(x => x));
  return ps.length === 1 ? ps[0] : null; 
}
