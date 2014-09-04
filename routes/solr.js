/**
 * Created by Alex Chew on 2014/9/4.
 */
var solr = require('solr-client');
//var solr = require('./../lib/solr');

// Create a client
var client = solr.createClient({host:"124.42.107.200",port:"8090",path:"/solr"});

// Switch on "auto commit", by default `client.autoCommit = false`
//client.autoCommit = true;

var logger = require('../log').logger;

//add docs to solr
exports.add = function(req,res){
    res.contentType = 'json';
    var doc = req.params;
    doc.title = decodeURIComponent(doc.title);
    doc.content = decodeURIComponent(doc.content);
    var docs = [];
    docs.push(doc);
    logger.debug("try to index doc.[title]"+doc.title);
    // Add documents
    client.add(docs,function(err,resp){
        if(err)
            res.send({status: "error", msg: err.message});
        else {
            if (resp)
                res.send({status: "success", resp: resp});
            else
                res.send({status:"",msg:"unknown response"});
        }
    });
};

//commit to solr
exports.commit = function(req,res){
    res.contentType = 'json';
    logger.debug("try to commit to solr.");
    client.commit(function(err,msg){
        if(err)
            res.send({status: "error", msg: err.message});
        else{
            if(msg)
                res.send({status: "success", msg: msg});
            else
                res.send({status:"",msg:"unknown response"});
        }
    });
};