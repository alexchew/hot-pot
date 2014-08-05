var restify = require('restify');
var log = require('./log');
var foodinfo = require('./routes/foodinfo');

var ip_addr = '127.0.0.1';
var port    =  '8090';

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
server.get('/foodinfo',foodinfo.get2);//查询
server.post('/foodinfo', foodinfo.post);//新建

server.listen(port ,ip_addr, function(){
    console.log('%s listening at %s ', server.name , server.url);
});




