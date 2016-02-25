const util = require('util');
const Building = require('./base');

function House(player) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    House.super_.apply(this, [{name:'Дом', prodInterval:5000}]);
}

util.inherits(House, Building);

House.prototype.process = function (){

    this.player.say('houseStart', this.toJSON());

    House.super_.prototype.process.apply(this, arguments);
};


House.prototype.done = function() {
    House.super_.prototype.done.apply(this, arguments);
    console.log(this.toJSON());
    this.player.say('houseUpdate', this.toJSON());
};


exports = module.exports = House;