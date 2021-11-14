const winston = require('winston');

const { createLogger, format } = winston;
const { combine, timestamp, label, printf } = format;

const myFormat = printf(info => {
	return `${info.level}: ${info.message} ${info.timestamp}`;
});

const logger = createLogger({
	format: combine(label({ label: 'my Label' }), timestamp(), myFormat),
	transports: [new winston.transports.Console({ level: 'silly' })],
});

module.exports = logger;
