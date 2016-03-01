const util = require('util');
const Building = require('./base');

function Mine(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Mine.super_.apply(this, [{name:'Шахта', prodInterval:5000,production:0,currentCapacity:0}]);
}

util.inherits(Mine, Building);

/**
 *
 * @returns {boolean}
 */
Mine.prototype.process = function (){

    if (this.workersCount == 0) {
        this.state = 0;
        return true;
    }

    this.player.emit('mineStarted');
    Mine.super_.prototype.process.apply(this, arguments);
};

/**
 *
 */
Mine.prototype.done = function() {
    Mine.super_.prototype.done.apply(this, arguments);
    this.player.emit('mineDone');
};






exports = module.exports = Mine;