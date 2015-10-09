var express = require('express'),
	router = express.Router();

var sites = require('./site'),
	comics = require('./comic'),
	chapters = require('./chapter'),
	search = require('./search');

router.use('/sites', sites);
router.use('/comics', comics);
router.use('/chapters', chapters);
router.use('/search', search);

module.exports = router;
