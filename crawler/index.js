var siteGetter = require('./sites/index');
var siteModel = require('../models/site');
var Executor = require('./executor');
var log = require('../lib/log');

function craw (type) {
	return new Promise(function (resolve, reject) {
		siteModel.findAll().then(function (sites) {
			var promise = Promise.resolve();
			if (sites.length > 0) {
				sites.forEach(function (site) {
					var executor = new Executor(site, type);
					promise = promise.then(executor.execute.bind(executor));
				});
			}
			promise.then(resolve).catch(reject);
		});
	});
};

module.exports = {
	get: function (siteName) {
		return siteGetter(siteName);
	},
	craw: craw
};
