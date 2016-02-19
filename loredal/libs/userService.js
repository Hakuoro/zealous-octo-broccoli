var fs = require('fs');
var Player = require('../models/player');

function UserService (opts){

    this.userDir = opts.userDir || './users/';
    this.userDir = fs.realpathSync(this.userDir)  + '/';

    this.app = opts.app;

}

UserService.prototype.initUser = function (name, passw){

    if (typeof(this.app.locals.players[name]) != 'undefined'){
        return  this.app.locals.players[name];
    }

    var player = '';

    if (!fs.existsSync(this.userDir + name)) {

        player = new Player({name:name});
        fs.writeFileSync(this.userDir + name, JSON.stringify(player.toJSON()));
        this.app.locals.players[name] = player;
        return player;
    }

    player = new Player(JSON.parse(fs.readFileSync(this.userDir + name)));

    this.app.locals.players[name] = player;

    return  player;
};


/**
 *
 * @param token
 * @returns false|Player
 */
UserService.prototype.getUser = function (token){

    if (typeof(this.app.locals.connections[token]) == 'undefined'){
        return false;
    }

    var name = this.app.locals.connections[token];

    if (typeof(this.app.locals.players[name]) == 'undefined'){
        return false;
    }

    return this.app.locals.players[name];
};

UserService.prototype.saveUser = function (player){

    fs.writeFileSync(this.userDir + player.name, JSON.stringify(player.toJSON()));
};

module.exports = UserService;