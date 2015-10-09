var Validator = {};

Validator.Types = {
	INT: 0x1,
	BOOL: 0x2,
	JSON: 0x4,
	STRING: 0x8
};

Validator.Validators = {};
Validator.Validators[Validator.Types.INT] = function (type) {
	return ! isNaN(parseInt(type, 10));
};
Validator.Validators[Validator.Types.BOOL] = function (type) {
	return typeof type === 'boolean' || type.toLowerCase() === 'true' || type.toLowerCase() === 'false';
};
Validator.Validators[Validator.Types.JSON] = function (type) {
	var isValid = true;
	try {
		JSON.parse(type)
	} catch (e) {
		isValid = false;
	}
	return isValid;
};
Validator.Validators[Validator.Types.STRING] = function (type) {
	return typeof type === 'string';
};

Validator.Formats = {
	comic: {
		title: Validator.Types.STRING,
		finished: Validator.Types.BOOL,
		comicInfo: Validator.Types.JSON
	},
	chapter: {
		comicId: Validator.Types.INT,
		modified: Validator.Types.BOOL,
		updateInfo: Validator.Types.JSON,
		chapters: {
			_isArray: true,
			title: Validator.Types.STRING,
			no: Validator.Types.INT,
			pages: Validator.Types.INT,
			renderInfo: Validator.Types.JSON
		}
	},
	render: {
		_isArray: true,
		url: Validator.Types.URL,
		referer: Validator.Types.URL
	}
};

Validator.ValidateObject = function (root, doc) {
	// TODO
	return true;
};

Validator.Validate = function (type, obj) {
	try {
		if (Validator.ValidateObject(obj, Validator.Formats[type])) {
			return obj;
		}
	} catch (e) {
		console.error(e);
		return false;
	}
};

module.exports = Validator;
