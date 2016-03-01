var sockjs = require('sockjs');
var sockjs_opts = {sockjs_url: "https://cdnjs.cloudflare.com/ajax/libs/sockjs-client/1.0.3/sockjs.min.js"};
var UserService = require('./userService');

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
        var us = new UserService({app:app});

        var player = null;

        conn.on('data', function (message) {

            message = JSON.parse(message);

            console.log(message);

            if ( message.f == 'initPlayer' ){

                token = message.name + '123asd';  // todo token generation
                player = us.initUser(message.name, '');


                app.locals.connections[token] = player.name;

                player.init({conn:conn});

                var send = {
                    f:'setT',
                    token:token,
                    player:player.toJSON()
                };

                conn.write(JSON.stringify(send));

                updatePlayerRef = setInterval(function() {
                    us.saveUser(player);
                }, 5000);

                return;
            }

            if ( message.f != 'getT' && (typeof(message.t) == 'undefined' || message.t == '' || us.getUser(message.t) == false) ){

                conn.write(JSON.stringify({
                    f:'forbidden'
                }));
                return true;
            }


            player = us.getUser(message.t);

            if (!player){
                conn.write(JSON.stringify({
                    f:'forbidden1'
                }));
                return true;
            }

            if ( message.f == 'startAll'){
                player.house.start();
                player.farm.start();
            }

            if ( message.f == 'houseStart'){
                player.house.start();
            }

            if ( message.f == 'farmStart'){
                player.farm.start();
            }

            if ( message.f == 'addWorker'){

                switch (message.b) {
                    case 'farm':
                        player.addFarmer();
                        break
                    case 'mine':
                        player.addMiner();
                        break
                    default:
                        return true;
                }



            }

        });

        conn.on('close', function () {
            clearInterval(updatePlayerRef);
            //clearInterval(updatePlayerRef);

        });
    });

    chat.installHandlers(this._httpServer, {prefix: '/chat'});
};


server.prototype.stop = function (){


};

server.prototype.update = function (){


};



exports = module.exports = server;