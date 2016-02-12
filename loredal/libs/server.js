var sockjs = require('sockjs');
var sockjs_opts = {sockjs_url: "http://cdn.jsdelivr.net/sockjs/1.0.3/sockjs.min.js"};


var server = function (app, httpServer){
    this._app = app;
    this._httpServer = httpServer;
};


server.prototype.start = function (){

    var chat = sockjs.createServer(sockjs_opts);

    var app = this._app;

    chat.on('connection', function (conn) {

        var token = '';
        var updateRef, updatePlayerRef = '';

        conn.on('data', function (message) {

            message = JSON.parse(message);

            console.log(message);

            if ( message.f != 'getT' && (typeof(message.t) == 'undefined' || message.t == '' || typeof(app.locals.players[message.t]) == 'undefined') ){

                conn.write(JSON.stringify({
                    f:'forbidden'
                }));
                return true;
            }

            if ( message.f == 'getT' ){

                token = '123asd';  // todo token generation

                var send = {
                    f:'setT',
                    token:token,
                    player:app.locals.players[token].toJSON()
                };

                conn.write(JSON.stringify(send));

                app.locals.connections[token] = conn;
                app.locals.players[token].init({conn:conn})

                updateRef = setInterval(function() {
                    app.locals.players[token].update();
                }, app.locals.players[token].interval);

                return;
            }

            if (message.f == 'startBattle'){
                app.locals.players[token].startBattle();
            }

        });

        conn.on('close', function () {
            clearInterval(updateRef);
            //clearInterval(updatePlayerRef);
            /*for (var ii = 0; ii < connections.length; ii++) {
             connections[ii].write("User " + number + " has disconnected");
             }
             connections.splice(number - 1, 1);*/
        });
    });

    chat.installHandlers(this._httpServer, {prefix: '/chat'});
};


server.prototype.stop = function (){


};

server.prototype.update = function (){


};



exports = module.exports = server;