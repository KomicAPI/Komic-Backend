var express = require('express'),
	router = express.Router();

var chapterModel = require('../models/chapter'),
	comicModel = require('../models/comic'),
	siteModel = require('../models/site');

var crawler = require('../crawler/index');

router.get('/', function(req, res, next) {
	chapterModel.findAll().then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

router.get('/:id/pictures', function(req, res, next) {
	chapterModel.findOne({
		where: {id: req.params.id},
		include: [{
			model: comicModel,
			include: [{
				model: siteModel
			}]
		}]
	}).then(function (result) {
		if (result) {
			var siteParser = crawler.get(result.Comic.Site.name);
			var meta = {
				renderInfo: result.renderInfo,
				comicInfo: result.Comic.comicInfo
			};
			res.json(siteParser.getPicture(meta));
		} else {
			res.json({results: null});
		}
	}, function (err) {
		res.json({err: err});
	});
});

router.get('/:id', function(req, res, next) {
	chapterModel.findById(req.params.id).then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

module.exports = router;
