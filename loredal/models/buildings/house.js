const util = require('util');
const Building = require('./base');

function House(player) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    House.super_.apply(this, [{name:'Дом', prodInterval:5000,currentCapacity:5}]);
}

util.inherits(House, Building);

House.prototype.process = function (){

    console.log('house started');

    this.player.emit('houseStarted');
    House.super_.prototype.process.apply(this, arguments);
};

House.prototype.done = function() {
    House.super_.prototype.done.apply(this, arguments);
    this.player.emit('houseDone');
};


exports = module.exports = House;