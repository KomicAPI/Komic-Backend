var winston = require('winston'),
	logger = new winston.Logger({
		transports: [
			new winston.transports.Console({
				handleExceptions: true,
				colorize: true,
				level: 'debug'
			})
		],
		exitOnError: false
	});

module.exports = logger;