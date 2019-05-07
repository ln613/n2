const jwt = require('jsonwebtoken');
const { res } = require('./utils');

module.exports.handler = async event => {
  if (event.httpMethod !== 'POST' || !event.body) {
    return res({});
  } else {
    const { username, password } = JSON.parse(event.body);

    if (username != process.env.ADMIN_USER || password != process.env.ADMIN_PASSWORD) {
      return res({ isAuthenticated: false }, 401);
    } else {
      const token = jwt.sign({}, process.env.JWT_SECRET, { expiresIn: '24h' });
      return res({ isAuthenticated: true, token });
    };
  }
};
