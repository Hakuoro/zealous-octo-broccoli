const EventEmitter = require('events');
const util = require('util');
var House = require('./buildings/house');
var Farm = require('./buildings/farm');
var Mine = require('./buildings/mine');
var Forge = require('./buildings/forge');

function Player (opts){
    this.name   = opts.name || "Boris";
    this.house  = null;
    this.farm   = null;
    this.forge   = null;
}


util.inherits(Player, EventEmitter);

module.exports = Player;

Player.prototype.init = function (opts){

    this.setConnection(opts.conn);

    this.house  = new House(this);
    this.farm   = new Farm(this, {});
    this.mine   = new Mine(this, {});
    this.forge   = new Forge(this, {});

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
        farm:this.farm?this.farm.toJSON():{},
        forge:this.forge?this.forge.toJSON():{}

    };

};

Player.prototype.free = function (){

    this.house.player   = null;
    this.farm.player    = null;
    this.mine.player    = null;
    this.forge.player    = null;

};

/**********************************************************/

Player.prototype.on('houseDone', function() {
    this.say('houseDone', this.house.toJSON());
});

Player.prototype.on('houseStarted', function() {
    this.say('houseStarted', this.house.toJSON());
});

Player.prototype.on('houseUpdate', function() {
    this.say('houseUpdate', this.house.toJSON());
});

/**********************************************************/

Player.prototype.on('farmStarted', function() {
    this.say('farmStarted', this.farm.toJSON());
});

Player.prototype.on('farmDone', function() {
    // try to start mine when food is ready
    this.mine.start();
    this.say('farmDone', this.farm.toJSON());
});

Player.prototype.on('farmUpdate', function() {
    this.say('farmUpdate', this.farm.toJSON());
});

/**********************************************************/

Player.prototype.on('mineStarted', function() {
    this.say('mineStarted', this.mine.toJSON());
});

Player.prototype.on('mineDone', function() {
    this.say('mineDone', this.mine.toJSON());
});

Player.prototype.on('mineUpdate', function() {
    this.say('mineUpdate', this.mine.toJSON());
});

/**********************************************************/


Player.prototype.on('forgeStarted', function() {
    this.say('forgeStarted', this.forge.toJSON());
});

Player.prototype.on('forgeDone', function() {
    this.say('forgeDone', this.forge.toJSON());
});

Player.prototype.on('forgeUpdate', function() {
    this.say('forgeUpdate', this.forge.toJSON());
});

Player.prototype.addFarmer = function() {

    if (this.house.currentCapacity <= 0 || this.farm.workersCount >= this.farm.getMaxWorkersCount()){
        return false;
    }

    this.house.currentCapacity --;
    this.house.start();
    this.farm.workersCount ++;

    this.say('addFarmer', this.farm.toJSON());
    this.say('houseUpdate', this.house.toJSON());

    this.farm.start();
};

Player.prototype.addMiner = function() {

    if (this.house.currentCapacity <= 0 || this.mine.workersCount >= this.mine.getMaxWorkersCount()){
        return false;
    }

    this.house.currentCapacity --;
    this.house.start();
    this.mine.workersCount ++;

    this.say('addMiner', this.mine.toJSON());
    this.say('houseUpdate', this.house.toJSON());

    this.mine.start();
};

Player.prototype.addBlacksmith = function() {

    if (this.house.currentCapacity <= 0 || this.forge.workersCount >= this.forge.getMaxWorkersCount()){
        return false;
    }

    this.house.currentCapacity --;
    this.house.start();
    this.forge.workersCount ++;

    this.say('addBlacksmith', this.forge.toJSON());
    this.say('houseUpdate', this.house.toJSON());

    this.forge.start();
};