const R = require('ramda');
const fs = require('fs');
const path = require('path');

const e = {};

e.isProd = process.env.NODE_ENV === 'PROD';

e.cd = 'http://res.cloudinary.com/vttc/image/upload/v1522908408/';

e.tap = x => R.tap(console.log, R.isNil(x) ? 'null' : x);

e.config = fs.existsSync(path.join(__dirname, 'config.js')) ? require('./config') : null;

const send = d => (p, res) => p.then(x => res.json(d || x)).catch(e => res.send(e))

e.done = send('done')

e.send = send()

e.port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080

e.ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0'

e.getMongoURL = () => {
  let mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL || 'mongodb://localhost:27017/vttc';
  if (process.env.DATABASE_SERVICE_NAME) {
    const mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase();
    const mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'];
    const mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'];
    const mongoDatabase = process.env[mongoServiceName + '_DATABASE'];
    const mongoPassword = process.env[mongoServiceName + '_PASSWORD'];
    const mongoUser = process.env[mongoServiceName + '_USER'];

    if (mongoHost && mongoPort && mongoDatabase) {
      mongoURL = 'mongodb://';
      if (mongoUser && mongoPassword) {
        mongoURL += mongoUser + ':' + mongoPassword + '@';
      }
      mongoURL += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    }
  }
  return mongoURL;
}

e.mongoURL = e.getMongoURL()

e.secret = e.config ? e.config.secret : process.env.secret
e.username = e.config ? e.config.username : process.env.username
e.password = e.config ? e.config.password : process.env.password

e.cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
}

e.nocache = (req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

e.gotoLogin = res => {
  res.clearCookie('vttc_token');
  res.redirect('/login');
}

const rrCycle = (x, r, l) => x < r ? x - r + l : x - r + 1;

e.rrSchedule = (x, sorted) => {
  const l = sorted ? x : R.sortWith([R.descend(R.prop('rating'))], x);
  const t1 = R.range(1, l.length);
  const t2 = R.range(0, l.length / 2);
  return t1.map(r => {
    const l1 = t1.map(n => l[rrCycle(n, r, l.length)]);
    const l2 = R.insert(0, l[0], l1);
    return t2.map((n, i) => ({ id: i + 1, home: l2[n].id, away: l2[l.length - n - 1].id }));
  })
}

e.json2js = x => JSON.parse(x, (k, v) => R.takeLast(4, k).toLowerCase() === 'date' ? new Date(v) : v)

const rdiff = [[3,0],[5,-2],[8,-5],[10,-7],[13,-9],[15,-11],[18,-14],[20,-16],[25,-21],[30,-26],[35,-31],[40,-36],[45,-41],[50,-45],[55,-50]];
const rdelta = [401,301,201,151,101,51,26,-24,-49,-99,-149,-199,-299,-399];

const rateDiff = (r1, r2) => {
  const n = rdelta.findIndex(x => x <= r1 - r2);
  return n === -1 ? R.last(rdiff) : rdiff[n];
}

e.adjustRating = g => {
  if (g.isDouble) {
      return g;
  } else {
    const p1Win = g.result[0] === '3';
    const d = p1Win ? rateDiff(g.p1Rating, g.p2Rating) : rateDiff(g.p2Rating, g.p1Rating);
    return Object.assign({}, g, { p1Diff: p1Win ? d[0] : d[1], p2Diff: p1Win ? d[1] : d[0] });
  }
}

e.newRating = (r, d) => Math.max(r + d, 100)

module.exports = e;