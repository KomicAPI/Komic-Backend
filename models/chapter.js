var Sequelize = require('sequelize'),
	db = require("../lib/db"),
	Comic = require("./comic");

var Chapter = db.define('chapter', {
	id : {type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true},
	comicId: {type: Sequelize.INTEGER, unique: "comicTitle"},
	title : {type: Sequelize.STRING, unique: "comicTitle"},
	no : {type: Sequelize.INTEGER},
	pages : {type: Sequelize.INTEGER},
	renderInfo : {type: Sequelize.TEXT}
});

Chapter.belongsTo(Comic);

module.exports = Chapter;