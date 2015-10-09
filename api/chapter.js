var express = require('express'),
	router = express.Router();

var chapterModel = require('../models/chapter');

/* GET home page. */
router.get('/', function(req, res, next) {
	chapterModel.findAll().then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

router.get('/:id', function(req, res, next) {
	siteModel.findById(req.params.id).then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

module.exports = router;
