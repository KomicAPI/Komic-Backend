var exec = require('child_process').exec,
	validator = require('./validator'),
	Sequelize = require('sequelize'),
	_ = require('underscore'),
	db = require('../lib/db'),
	log = require('../lib/log'),
	comicModel = require('../models/comic'),
	chapterModel = require('../models/chapter'),
	dbPromise = db.Promise,
	siteGetter = require('./sites/index');

var Executor = function (site, type) {
	this.dbSite = site;
	this.site = siteGetter(site.crawler);
	this.type = type;
	log.debug('new executor: ', site.crawler, 'type', type);
};

Executor.prototype.execute = function () {
	if (this.type === 'comic') {
		return this.executeRowPromise();
	} else if (this.type === 'chapter') {
		return new Promise(function (resolve, reject) {
			comicModel.findAll({
				where: { siteId: this.dbSite.id, finished: false }
			}).then(function (comics) {
				var promise = Promise.resolve();

				comics.forEach(function (comic) {
					promise = promise.then(this.executeRowPromise.bind(this, {
						comicId: comic.id,
						comicInfo: JSON.parse(comic.comicInfo),
						updateInfo: JSON.parse(comic.updateInfo)
					}));
				});

				promise.then(resolve).catch(reject);
			}).catch(function (e) {
				reject(e);
			});
		});
	} else {
		return Promise.reject('type error');
	}
};

Executor.prototype.executeRowPromise = function (info) {
	log.debug('craw type[', this.type, '], info: ', info);
	return this.site.craw(this.type, info)
		.then(function (resultJSON) {
			if (false === (resultJSON = validator.Validate(this.type, resultJSON))) {
				throw 'validation failed.';
			}
			return resultJSON;
		}.bind(this))
		.then(function (resultJSON) {
			return this.saveToDB(resultJSON);
		}.bind(this));
};

// saveToDB: save result JSON to Database
Executor.prototype.saveToDB = function (resultJSON) {
	return Executor.saveToDB[this.type].call(this, resultJSON);
};

Executor.saveToDB = {};
Executor.saveToDB.comic = function (resultJSON) {
	var siteId = this.dbSite.id;
	return db.transaction(function (trans) {
		var jobs = [];
		resultJSON.forEach(function (result) {
			result.comicInfo = JSON.stringify(result.comicInfo);
			result.siteId = siteId;
			jobs.push(comicModel.upsert(result, {transaction: trans}));
		});
		return dbPromise.all(jobs);
	});
};

Executor.saveToDB.chapter = function (resultJSON) {
	if (! resultJSON.modified) {
		log.info('not modified, pass.');
		return true;
	}
	var jobs = [],
		comicId = resultJSON.comicId;
	resultJSON.updateInfo = JSON.stringify(resultJSON.updateInfo);
	jobs.push(comicModel.update({updateInfo: resultJSON.updateInfo}, {
		where: {
			id: comicId
		}
	}));
	jobs.push(db.transaction(function (trans) {
		var chain = [];
		resultJSON.chapters.forEach(function (result) {
			result.comicId = comicId;
			result.renderInfo = JSON.stringify(result.renderInfo);
			chain.push(chapterModel.upsert(result, {transaction: trans}));
		});
		return dbPromise.all(chain);
	}));
	return dbPromise.all(jobs);
};

module.exports = Executor;
