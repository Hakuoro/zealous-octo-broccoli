const util = require('util');
const Building = require('./base');

function Farm(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Farm.super_.apply(this, [{name:'Ферма', prodInterval:5000,production:0,currentCapacity:0}]);

}

util.inherits(Farm, Building);


/**
 *
 * @returns {boolean}
 */
Farm.prototype.process = function (){


    if (this.workersCount == 0) {
        this.state = 0;
        return true;
    }

    this.player.emit('farmStarted');
    Farm.super_.prototype.process.apply(this, arguments);
};

/**
 *
 */
Farm.prototype.done = function() {
    Farm.super_.prototype.done.apply(this, arguments);
    this.player.emit('farmDone');
};

exports = module.exports = Farm;