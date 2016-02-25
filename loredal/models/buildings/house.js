const util = require('util');
const Building = require('./base');

function House(player) {
    this.player = player;
    Building.call(this, {name:'Дом'});

}

util.inherits(House, Building);


House.prototype.done = function() {
    House.super_.prototype.done.apply(this, arguments);
    this.player.say('houseUpdate', this.toJSON());
};


exports = module.exports = House;