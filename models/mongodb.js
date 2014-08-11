/**
 * Created by Alex Chew on 2014/7/14.
 */
var logger = require('../log').logger;
var mongoose = require('mongoose');
var config = require('../config');

var connected = false;//no use actually

//var conn_string ='mongodb://life2:life2@ds061189.mongolab.com:61189/life2' ;
var conn_string ='mongodb://localhost/hotpot';
mongoose.connect(config.get('mongo'));

mongoose.connection.on('open', function (ref) {
    connected=true;
    console.log('mongo url is %s ', config.get('mongo'));
    logger.debug('open connection to mongo server.');
});

mongoose.connection.on('connected', function (ref) {
    connected=true;
    logger.debug('connected to mongo server.');
});

mongoose.connection.on('disconnected', function (ref) {
    connected=false;
    logger.debug('disconnected from mongo server.');
});

mongoose.connection.on('close', function (ref) {
    connected=false;
    logger.debug('close connection to mongo server');
});

mongoose.connection.on('error', function (err) {
    connected=false;
    logger.debug('error connection to mongo server!');
    logger.error(err);
});

mongoose.connection.db.on('reconnect', function (ref) {
    connected=true;
    logger.debug('reconnect to mongo server.');
});

exports.mongoose = mongoose;