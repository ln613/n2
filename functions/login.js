const jwt = require('jsonwebtoken');
const { res, res401, resAuth, authorize } = require('./utils');

module.exports.handler = async event => {
  if (event.httpMethod === 'OPTIONS') {
    return res();
  } else if (event.httpMethod === 'POST' && event.body) {
    const { username, password } = JSON.parse(event.body);

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '24h' });
      return resAuth(token);
    };
  } else if (event.httpMethod === 'PATCH' && await authorize(event.headers.authorization)) {
    return resAuth();
  }

  return res401();
};
