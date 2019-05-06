const jwt = require('jsonwebtoken');
const { res } = require('./utils');

module.exports.handler = async event => {
  const { username, password } = JSON.parse(event.body);

  if (username != process.env.REACT_APP_ADMIN_USER || password != process.env.REACT_APP_ADMIN_PASSWORD) {
    return res({ isAuthenticated: false }, 401);
  } else {
    const token = jwt.sign({}, process.env.REACT_APP_JWT_SECRET, { expiresIn: '24h' });
    return res({ isAuthenticated: true, token });
  };
};
