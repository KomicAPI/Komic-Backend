var express = require('express'),
	router = express.Router();

var comicModel = require('../models/comic'),
	chapterModel = require('../models/chapter');

router.get('/', function(req, res, next) {
	comicModel.findAll().then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

router.get('/:id/chapter', function(req, res, next) {
	chapterModel.findAll({ where: { comicId: req.params.id } }).then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

router.get('/:id', function(req, res, next) {
	comicModel.findById(req.params.id).then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

module.exports = router;
