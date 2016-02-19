/**
 * Module dependencies.
 */

var express = require('express');
var login = require('./routes/login');
var game = require('./routes/index');
var Player = require('./models/player');
var http = require('http');
var path = require('path');

var Server = require('./libs/server.js');

var app = express();


var connections = [];
var players = [];


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
app.locals.players = players;


//app.get('/', login.login);
app.get('/', game.index);

var httpServer = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});


var server = new Server(app, httpServer);

server.start();