/**
 * Created by Alex Chew on 2014/7/14.
 */
var logger = require('../log').logger;
var mongoose = require('mongoose');
try {
//mongoose.connect('mongodb://localhost/life2');
    mongoose.connect('mongodb://life2:life2@ds061189.mongolab.com:61189/life2');
}catch(err){
    logger.error("cannot connect to mongodb.[error]"+err.message);
}
exports.mongoose = mongoose;