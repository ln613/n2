const { res } = require('./utils');

module.exports.handler = () => res({ isAuthenticated: false });
