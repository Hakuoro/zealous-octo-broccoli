/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var userList = require('./routes/user');
var user = require('./models/user');
var http = require('http');
var path = require('path');

var Server = require('./libs/server.js');

var app = express();


var connections = [];
var users = [];

users["123asd"] = "Boris";


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

var httpServer = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


var server = new Server(app, httpServer);

server.start();