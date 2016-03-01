const EventEmitter = require('events');
const util = require('util');
var House = require('./buildings/house');
var Farm = require('./buildings/farm');
var Mine = require('./buildings/mine');

function Player (opts){
    this.name   = opts.name || "Boris";
    this.house  = null;
    this.farm   = null;
    this.ьшту   = null;
}


util.inherits(Player, EventEmitter);

module.exports = Player;

Player.prototype.init = function (opts){

    this.setConnection(opts.conn);

    this.house  = new House(this);
    this.farm   = new Farm(this, {});
    this.mine   = new Mine(this, {});

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

Player.prototype.on('houseStarted', function() {
    this.say('houseStarted', this.house.toJSON());
});

Player.prototype.on('farmStarted', function() {
    this.say('farmStarted', this.farm.toJSON());
});

Player.prototype.on('farmDone', function() {
    this.say('farmDone', this.farm.toJSON());
});


Player.prototype.addFarmer = function() {

    if (this.house.currentCapacity <= 0 || this.farm.workersCount >= this.farm.getMaxWorkersCount()){
        return false;
    }

    this.house.currentCapacity --;
    this.farm.workersCount ++;

    this.say('addFarmer', this.farm.toJSON());

    this.farm.start();
};

Player.prototype.addMiner = function() {

    if (this.house.currentCapacity <= 0 || this.mine.workersCount >= this.mine.getMaxWorkersCount()){
        return false;
    }

    this.house.currentCapacity --;
    this.mine.workersCount ++;

    this.say('addMiner', this.mine.toJSON());

    this.mine.start();
};