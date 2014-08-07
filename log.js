/**
 * Created by Alex Chew on 2014/7/31.
 */
var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'console',
            category: "console"
        },
        {
            type: "dateFile",
            filename: 'logs/log.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            category: 'dateFileLog'
        }
    ],
    replaceConsole: true,
    levels:{
        dateFileLog: 'DEBUG'
    }
});

var dateFileLog = log4js.getLogger('console');

exports.logger = dateFileLog;

exports.use = function(app) {
    app.use(log4js.connectLogger(dateFileLog, {level:log4js.levels.DEBUG /*, format:':method :url'*/}));
}