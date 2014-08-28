/**
 * Created by Alex Chew on 2014/7/14.
 */
var MyFav = require('./../models/MyFav');
var logger = require('../log').logger;

//CRUD
exports.post = function(req,res){
    res.contentType = 'json';
    var item = req.params;
    var t = new MyFav(item);
    logger.debug("try to save myfav info.[info]"+JSON.stringify(item));
    t.save(function (err, raw, numberAffected) {
        if (err){//error
            res.send({status: "error", msg: err.message});
        }else { // saved!
            res.send({numberAffected: numberAffected, resp: raw});
            //logger.debug("new MyFav created."+JSON.stringify(MyFav));
        }
    });
    //res.send(JSON.stringify({'success':true,"operation":"post"}));
};

exports.delete = function(req,res){
    res.contentType = 'json';
    logger.debug("try to delete myfav info.[query]"+JSON.stringify(req.params));
    MyFav.findOneAndRemove(req.params,function (err,raw) {
        if (err) return handleError(err);
        var ret = {doc:raw};
        res.send(ret);
    });
    //res.send(JSON.stringify({'success':true,"operation":"delete"}));
};

exports.get2 = function(req,res){
    res.contentType = 'json';
    logger.debug("try to query myfav info.[query]"+JSON.stringify(req.params));
    try {
        MyFav.find(req.params).sort({created:-1}).exec( function (arr, items) {
            if (!items || items.length == 0)
                res.send([]);
            else
                res.send(items);
        });
    }catch(err) {
        res.send({success:false,operation:"batch get",error:err.message});
    }
};