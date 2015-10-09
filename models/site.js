var Sequelize = require('sequelize'),
	db = require("../lib/db");

var Site = db.define('site', {
	id : {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	name : {type: Sequelize.STRING, unique: true},
	crawler : {type: Sequelize.STRING, unique: true}
}, {timestamp: false});

module.exports = Site;