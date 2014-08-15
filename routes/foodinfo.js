/**
 * Created by Alex Chew on 2014/7/14.
 */
var FoodInfo = require('./../models/FoodInfo');
var logger = require('../log').logger;

/*
Here we accept encodeURIComponent JSON data as input
 */
function decodeJSON(item){
    //var encodeItem = {title:"",code:"",time:"",url:"",area:[],tag:[],food:[],source:[]};
    var encodeItem = item;
    encodeItem.title = decodeURIComponent(item.title);
    encodeItem.url = decodeURIComponent(item.url);
    encodeItem.code = item.code;
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

function encodeJSONs(items){
    encodeItems = [];
    for(var i=0;i<items.length;i++)
        encodeItems[i]=encodeJSON(items[i]);
    return encodeItems;
}

function encodeJSON(item){
    //var encodeItem = {code:"",title:"",time:"",url:"",area:[],tag:[],food:[],source:[]};
    var encodeItem = item;
    encodeItem.title = encodeURIComponent(item.title);
    encodeItem.url = encodeURIComponent(item.url);
    encodeItem.code = item.code;
    encodeItem.time = item.time;
    var areas=[];
    for(var i in item.area){
        areas[i]=encodeURIComponent(item.area[i]);
    }
    encodeItem.area = areas;

    var foods=[];
    for(var i in item.food){
        foods[i]=encodeURIComponent(item.food[i]);
    }
    encodeItem.food = foods;

    var sources=[];
    for(var i in item.source){
        sources[i]=encodeURIComponent(item.source[i]);
    }
    encodeItem.source = sources;

    var tags=[];
    for(var i in item.tag){
        tags[i]=encodeURIComponent(item.tag[i]);
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
    res.contentType = 'json';
    FoodInfo.findOneAndRemove(req.params,function (err,raw) {
        if (err) return handleError(err);
        var ret = {doc:raw};
        res.send(ret);
    });
    //res.send(JSON.stringify({'success':true,"operation":"delete"}));
};

exports.put = function(req,res){
    res.contentType = 'json';
    logger.debug("got put task.[req]"+JSON.stringify(req.params));
    var cond = req.params.cond;
    var obj = req.params.obj;
    FoodInfo.update(cond,obj,/*{ multi: true },*/function (err, numberAffected, raw) {
        if (err) return handleError(err);
        var ret = {numberAffected:numberAffected,resp:raw};
        res.send(ret);
    });
    //res.send(JSON.stringify({'success':true,"operation":"put"}));
};

exports.get = function(req,res){
    res.contentType="json";
    //res.charset = "utf-8";
    //res.header("Content-Type", "application/json; charset=utf-8");
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    logger.debug("[get]"+JSON.stringify(req.params));
    try {
        FoodInfo.findOne(req.params, function (arr, FoodInfos) {
            logger.debug("[got foodInfo]\n"+JSON.stringify(FoodInfos));
            res.send(encodeJSON(FoodInfos));
        });
    }catch(err) {
        res.send({'success':false,"operation":"get","error":err.message});
    }
};

exports.patch = function(req,res){
    res.contentType = 'json';
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
        res.send(FoodInfo);
    });
    //res.send(JSON.stringify({'success':true,"operation":"get"}));
};

//batch CRUD
exports.post2 = function(req,res){
    res.contentType = 'json';
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
    res.send(ret);
};

exports.delete2 = function(req,res){
    res.contentType = 'json';
    FoodInfo.remove(req.params,function (err,numberAffected,raw) {
        if (err) return handleError(err);
        var ret = {numberAffected:numberAffected,resp:raw};
        res.send(ret);
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
    //res.contentType = 'json';
    res.header("Content-Type", "application/json; charset=utf-8");
    try {
        FoodInfo.find(req.params, function (arr, items) {
            if (!items || items.length == 0)
                res.send({result: 0});
            else
                res.send(items);
        });
    }catch(err) {
        res.send({success:false,operation:"batch get",error:err.message});
    }
};