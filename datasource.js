const Sequelize = require('sequelize');

module.exports = new Sequelize('sqlite:datastore.sqlite', {
  // disable logging; default: console.log
  logging: false,
});
