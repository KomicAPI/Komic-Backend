var siteModel = require('../models/site'),
	comicModel = require('../models/comic'),
	chapterModel = require('../models/chapter');

module.exports = function () {
	return siteModel.sync()
		.then(function () { return comicModel.sync(); })
		.then(function () { return chapterModel.sync(); });
};