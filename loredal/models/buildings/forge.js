const util = require('util');
const Building = require('./base');
const Warehouse = require('./warehouse');

function Forge(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Forge.super_.apply(this, [{name:'Кузня', prodInterval:5000,production:0,currentCapacity:0}]);

    this.storage = new Warehouse();
}

util.inherits(Forge, Building);

/**
 *
 * @returns {boolean}
 */
Forge.prototype.process = function (){

    if (this.workersCount == 0) {
        this.state = 0;
        return true;
    }

    this.player.emit('forgeStarted');
    Mine.super_.prototype.process.apply(this, arguments);
};


/**
 *  done production process
 * @returns {boolean}
 */
Forge.prototype.done = function (){

    this.state = 0;
    this.currentProduction = 0;

    this.currentCapacity += this.getProduction();

    if (this.currentCapacity > this.getCapacity()) {
        this.currentCapacity = this.getCapacity();
        return true;
    }

    this.addExp(this.productionExp);

    this.player.emit('forgeDone');
};



exports = module.exports = Forge;