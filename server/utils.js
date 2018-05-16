const R = require('ramda');
const fs = require('fs');
const path = require('path');

const e = {};

e.cd = 'http://res.cloudinary.com/vttc/image/upload/v1522908408/';

e.tap = x => R.tap(console.log, isNil(x) ? 'null' : x);

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
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
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
  res.redirect('login');
}

module.exports = e;