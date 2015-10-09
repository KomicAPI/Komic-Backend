var express = require('express'),
	router = express.Router();

var comicModel = require('../models/comic');

/* GET home page. */
router.get('/:keyword', function(req, res, next) {
	comicModel.findAll({ where: { title: { $like: req.params.keyword } } }).then(function (result) {
		res.json({results: result});
	}, function (err) {
		res.json({err: err});
	});
});

module.exports = router;
