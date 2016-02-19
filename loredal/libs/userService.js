var fs = require('fs');
var Player = require('../models/player');

function UserService (opts){

    this.userDir = opts.userDir || './users/';
    this.app = opts.app;

}

UserService.prototype.initUser = function (name, passw){

    if (typeof(this.app.locals.players[name]) != 'undefined'){
        return  this.app.locals.players[name];
    }

    var player = '';
    var path = fs.realpathSync(this.userDir) + '/';

    if (!fs.existsSync(path + name)) {

        player = new Player({name:name});
        fs.writeFileSync(path + name, JSON.stringify(player.toJSON()));
        this.app.locals.players[name] = player;
        return player;
    }

    player = new Player(JSON.parse(fs.readFileSync(path + name)));

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
}

module.exports = UserService;