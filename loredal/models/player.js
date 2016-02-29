const EventEmitter = require('events');
const util = require('util');
var House = require('./buildings/house');
var Farm = require('./buildings/farm');

function Player (opts){
    this.name   = opts.name || "Boris";
    this.house  = null;
    this.farm   = null;
}


util.inherits(Player, EventEmitter);

module.exports = Player;

Player.prototype.init = function (opts){

    this.setConnection(opts.conn);

    this.house  = new House(this);
    this.farm   = new Farm(this, {});

    //this.say('playerUpdate', this.toJSON());
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
        house:this.house?this.house.toJSON():{},
        farm:this.farm?this.farm.toJSON():{}

    };

};

Player.prototype.free = function (){

    this.house.player   = null;
    this.farm.player    = null;

};

Player.prototype.on('houseDone', function() {
    this.say('houseDone', this.house.toJSON());
});

Player.prototype.on('houseStart', function() {
    this.say('houseStart', this.house.toJSON());
});


Player.prototype.addFarmer = function() {

    if (this.house.currentCapacity <= 0 || this.farm.farmersCount >= this.farm.getMaxFarmersCount()){
        return false;
    }

    this.house.currentCapacity --;
    this.farm.farmersCount ++;

    console.log(this.farm.toJSON());

    this.say('addFarmer', this.farm.toJSON());

    this.farm.start();
};