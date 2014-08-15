var restify = require('restify');
//var favicon = require('static-favicon');
var log = require('./log');
var foodinfo = require('./routes/foodinfo');
var config = require('./config');

var ip_addr = '127.0.0.1';
var port    =  '8080';

var server = restify.createServer({
        formatters: {
            'application/json': function(req, res, body){
                if(req.params.callback){
                    var callbackFunctionName = req.params.callback.replace(/[^A-Za-z0-9_\.]/g, '');
                    return callbackFunctionName + "(" + JSON.stringify(body) + ");";
                } else {
                    return JSON.stringify(body);
                }
            },
            'text/html': function(req, res, body){
                return body;
            }
        }
    }
);

//enable log4js
log.use(server);

//server.use(favicon());
server.pre(restify.pre.sanitizePath());
//server.use(restify.acceptParser(server.acceptable));
//server.use(restify.jsonp());

server.use(restify.queryParser());
server.use(restify.bodyParser());

//server.use( restify.jsonBodyParser() );
server.use(restify.CORS());

/*
 //versioned REST API
 var PATH = '/hello/:name';
 server.get({path: PATH, version: '1.1.3'}, sendV1);
 server.get({path: PATH, version: '2.0.0'}, sendV2);
 */

/*
 FoodInfo
 */
server.get('/foodinfo',foodinfo.get);//查询
server.post('/foodinfo', foodinfo.post);//新建
server.put('/foodinfo',foodinfo.put);//更新

server.get('/foodinfos',foodinfo.get2);//批量

server.get('/', function(req, res) {
    res.contentType = "json";
    res.send({success:true,message:'It works. Now you can get what you want from the Hot-Pot.Enjoy!'});
});

//now start server. for Heroku we cannot use specified PORT. Heroku will pass it through process.env.PORT
server.listen(config.get('server.port'),/* config.get('server.ip'),*/ function(){
    console.log('%s listening at %s ', server.name , server.url);
    console.log('%s listening at %s ', server.name , config.get('server.port'));
});




