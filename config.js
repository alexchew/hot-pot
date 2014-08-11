/**
 * Created by Alex Chew on 2014/8/8.
 * refer: http://blog.nodejitsu.com/npmawesome-managing-app-configuration-with-convict/
 */
var convict = require('convict');

var config = convict({
    env: {
        doc: 'The applicaton environment.',
        format: ['production', 'development', 'test'],
        default: 'development',
        env: 'NODE_ENV',
        arg: 'env'
    },
    mongo: {
        doc: 'Main database',
        format: '*',//here we cannot use url for validation. but we can use a customized validate function
        default: 'mongodb://life2:life2@localhost/life2',
        env: 'MONGO_MAIN'
    },
    server: {
        ip: {
            doc: 'The IP address to bind.',
            format: 'ipaddress',
            default: '127.0.0.1',
            env: 'IP_ADDRESS'
        },
        port: {
            doc: 'HTTP port to bind.',
            format: 'port',
            default: 3080,
            env: 'HTTP_PORT'
        }
    }
});

// load environment dependent configuration
config.loadFile('./config/' + config.get('env') + '.json');

// validate
config.validate();

module.exports = config;