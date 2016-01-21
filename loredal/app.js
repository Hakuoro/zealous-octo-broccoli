/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var userList = require('./routes/user');
var user = require('./models/user');
var http = require('http');
var path = require('path');

var app = express();


var connections = [];
var users = {
    "123asd":"Boris"
};


var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.3/sockjs.min.js"};

var sockjs = require('sockjs');


var chat = sockjs.createServer(sockjs_opts);

//var u = new user('Boris');
//u.say('hello');

chat.on('connection', function (conn) {

    //connections.push(conn);

    var token = '';

    conn.on('data', function (message) {

        message = JSON.parse(message);


        if ( message.f != 'getT' && (typeof(message.t) == 'undefined' || message.t == '')){

            conn.write(JSON.stringify({
                f:'forbidden'
            }));
            return true;
        }

        if (typeof(users[message.t]) == 'undefined'){
            conn.write(JSON.stringify({
                f:'forbidden'
            }));
            return true;
        }







        if ( message.f == 'getT' ){

            token = '123asd';  // todo token generation

            var send = {
                f:'getT',
                token:token
            };

            conn.write(JSON.stringify(send));
            connections[token] = conn;
        }
    });

    conn.on('close', function () {
        /*for (var ii = 0; ii < connections.length; ii++) {
            connections[ii].write("User " + number + " has disconnected");
        }
        connections.splice(number - 1, 1);*/
    });
});

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.locals.connections = connections;
app.locals.users = users;

app.get('/', routes.index);
app.get('/users', userList.list);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

chat.installHandlers(server, {prefix: '/chat'});
