/**
 * Created by Alex Chew on 2014/7/14.
 */
var logger = require('../log').logger;

//CRUD
exports.invalid = function(req,res){
    res.contentType = "json";
    res.send({success:false,message:'The request is invalid. Please follow the instructions and get more information.'});
};
