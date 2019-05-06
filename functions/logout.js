const { res } = require('./utils');

module.exports.handler = async event => { return res({ isAuthenticated: false }); }
