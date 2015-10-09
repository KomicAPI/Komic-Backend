var request = require('request'),
	_ = require('underscore'),
	log = require('../../lib/log'),
	iconv = require('iconv-lite');

var URLS = {
		all: 'http://www.comicvip.com/comic/all.html'
	},
	REs = {
		allTitle: /<a href="\/html\/(\d+).html"[^>]+>([^<]+)<\/a>/g
	};

var crawler = {};

function craw (type, info) {
	return crawler[type](info);
}

crawler.comic = function () {
return new Promise(function (resolve, reject) {
	request({
		url: URLS.all,
		encoding: null
	}, function (error, response, body) {
		if (error || response.statusCode !== 200) {
			reject('url error');
		} else {
			resolve(parseTitles(iconv.decode(body, 'Big5')));
		}
	});
});
};

crawler.chapter = function () {
	// TODO
};

function parseTitles (html) {
	var reResult = REs.allTitle.exec(html),
		results = [];
	if (!reResult) {
		throw 'parse all title error, all title changed?';
	}
	do {
		var result = {
			title: _.unescape(reResult[2]),
			finished: false,
			comicInfo: {
				id: parseInt(reResult[1], 10)
			}
		};
		results.push(result);
		log.debug('just parsed: ', result);
	} while (reResult = REs.allTitle.exec(html));
	return results;
}

function getPicture (meta) {
	// TODO
	return [];
}

module.exports = {
	getPicture: getPicture,
	craw: craw
};
