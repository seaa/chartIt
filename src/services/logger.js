var log4js = require('log4js');
var logger = log4js.getLogger('charts');

logger.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

module.exports = logger;