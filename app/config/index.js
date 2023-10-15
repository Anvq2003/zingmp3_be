const serviceAccount = require('./firebase');
const myCustomLabels = require('./pagination');
const database = require('./database');

const config = {
  myCustomLabels,
  serviceAccount,
  database,
};

module.exports = config;
