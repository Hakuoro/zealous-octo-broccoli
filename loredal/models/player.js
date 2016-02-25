var House = require('./buildings/house');
function Player (opts){
    this.name = opts.name || "Boris";
    this.house = null;
}


module.exports = Player;

Player.prototype.init = function (opts){

    this.setConnection(opts.conn);

    this.house = new House(this);

    this.house.start();

    this.say('playerUpdate', this.toJSON());
};

Player.prototype.setConnection = function (connection){
    this.connection = connection;
};

Player.prototype.say = function (name, data){

    var send = {
        f:name,
        data:data
    };

    this.connection.write(JSON.stringify(send));
};

Player.prototype.toJSON = function (){

    return {
        name:this.name,
        house:this.house?this.house.toJSON():{}

    };

};

Player.prototype.free = function (){

    this.house.player = null;

};