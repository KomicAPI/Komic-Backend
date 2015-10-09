var express = require('express'),
	router = express.Router();

var siteModel = require('../models/site'),
	comicModel = require('../models/comic');

/* GET home page. */
router.get('/', function(req, res, next) {
	siteModel.findAll().then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

router.get('/:id/comics', function(req, res, next) {
	comicModel.findAll({ where: { siteId: req.params.id } }).then(function (result) {
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
