const mongoose = require('mongoose');
module.exports = {
  PORT: process.env.PORT || 8080,
  // other stuff
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL ||
    "http://localhost:3000/api"
};
exports.DATABASE_URL =
    process.env.DATABASE_URL ||
    global.DATABASE_URL ||
    'mongodb://localhost:27017/wod-clock-api';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET || 'access_token';
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';
//test database url info
exports.TEST_DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  global.TEST_DATABASE_URL||
  mongoose.connect('mongodb://localhost:27017/wod-clock-api');
