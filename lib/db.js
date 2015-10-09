var Sequelize = require('sequelize');
var sequelize = new Sequelize('komic', 'komic', 'komic', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

module.exports = sequelize;
