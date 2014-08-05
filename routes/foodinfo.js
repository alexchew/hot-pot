/**
 * Created by Alex Chew on 2014/7/14.
 */
var FoodInfo = require('./../models/FoodInfo');
var logger = require('../log').logger;

/*
Here we accept encodeURIComponent JSON data as input
 */
function decodeJSON(item){
    var encodeItem = {title:"",time:"",url:"",area:[],tag:[],food:[],source:[]};
    encodeItem.title = decodeURIComponent(item.title);
    encodeItem.url = decodeURIComponent(item.url);
    encodeItem.time = item.time;
    var areas=[];
    for(var i in item.area){
        areas[i]=decodeURIComponent(item.area[i]);
    }
    encodeItem.area = areas;

    var foods=[];
    for(var i in item.food){
        foods[i]=decodeURIComponent(item.food[i]);
    }
    encodeItem.food = foods;

    var sources=[];
    for(var i in item.source){
        sources[i]=decodeURIComponent(item.source[i]);
    }
    encodeItem.source = sources;

    var tags=[];
    for(var i in item.tag){
        tags[i]=decodeURIComponent(item.tag[i]);
    }
    encodeItem.tag = tags;
    logger.debug("[old]"+JSON.stringify(item));
    logger.debug("[new]"+JSON.stringify(encodeItem));
    return encodeItem;
};

//CRUD
exports.post = function(req,res){

    res.contentType = 'json';
    var item = decodeJSON(req.params);
    var t = new FoodInfo(item);
    logger.debug("try to save food info.[info]"+JSON.stringify(item));
    t.save(function (err, raw, numberAffected) {
        if (err){//error
            res.send({status: "error", msg: err.message});
        }else { // saved!
            res.send({numberAffected: numberAffected, resp: raw});
            //logger.debug("new FoodInfo created."+JSON.stringify(FoodInfo));
        }
    });
    //res.send(JSON.stringify({'success':true,"operation":"post"}));
};

exports.delete = function(req,res){
    FoodInfo.findOneAndRemove(req.params,function (err,raw) {
        if (err) return handleError(err);
        var ret = {doc:raw};
        res.send(JSON.stringify(ret));
    });
    //res.send(JSON.stringify({'success':true,"operation":"delete"}));
};

exports.put = function(req,res){
    var cond = JSON.parse(req.params.cond);
    var obj = JSON.parse(req.params.obj);
    FoodInfo.update(cond,obj,/*{ multi: true },*/function (err, numberAffected, raw) {
        if (err) return handleError(err);
        var ret = {numberAffected:numberAffected,resp:raw};
        res.send(JSON.stringify(ret));
    });
    //res.send(JSON.stringify({'success':true,"operation":"put"}));
};

exports.get = function(req,res){
    FoodInfo.findOne(req.params,function (arr,FoodInfos) {
        res.send(JSON.stringify(FoodInfos));
    });
    //res.send(JSON.stringify({'success':true,"operation":"get"}));
};

exports.patch = function(req,res){
    //var cond = JSON.parse(req.params.cond);
    //var obj = JSON.parse(req.params.obj);
    var type = req.params.type;

    var cond = {executor: ""};
    var upd = {executor: req.params.executor};

    if("finish"==type){
        cond = {executor: req.params.executor};
        upd = {executes:1};
    }

    FoodInfo.findOneAndUpdate(cond, upd, function (arr, FoodInfo) {
        res.send(JSON.stringify(FoodInfo));
    });
    //res.send(JSON.stringify({'success':true,"operation":"get"}));
};

//batch CRUD
exports.post2 = function(req,res){
    var count = 0;
    var saved = 0;
    var data = JSON.parse(req.params.data);
    logger.debug("trying post FoodInfos."+JSON.stringify(data));
    for(var i in data) {
        var t = new FoodInfo(data[i]);
        t.save(function (err, raw, numberAffected) {
            if (err) return handleError(err);
            // saved!
            //saved += numberAffected;//ERROR!!! you cannot manipulate this variable in a callback function
            logger.debug("new FoodInfo created."+raw);
        });
        count++;
    }
    var ret = {post:count,saved:saved,memo:"we cannot get total numberAffected FoodInfos"};
    res.send(JSON.stringify(ret));
};

exports.delete2 = function(req,res){
    FoodInfo.remove(req.params,function (err,numberAffected,raw) {
        if (err) return handleError(err);
        var ret = {numberAffected:numberAffected,resp:raw};
        res.send(JSON.stringify(ret));
    });
    //res.send(JSON.stringify({'success':true,"operation":"batch delete"}));
};

exports.put2 = function(req,res){
    res.contentType = 'json';
    var cond = JSON.parse(req.params.cond);
    var obj = JSON.parse(req.params.obj);
    FoodInfo.update(cond,obj,{ multi: true },function (err, numberAffected, raw) {
        if (err)
            res.send({result:"error",message:err.message});
        else {
            var ret = {numberAffected: numberAffected, resp: raw};
            res.send(ret);
        }
    });
    //res.send(JSON.stringify({'success':true,"operation":"batch put"}));
};

exports.get2 = function(req,res){
    res.contentType = 'json';
    FoodInfo.find(req.params,function (arr,items) {
        if(!items || items.length ==0)
            res.send({result:0});
        else
            res.send(items);
    });
   // res.send(JSON.stringify({success:true,operation:"batch get"}));
};