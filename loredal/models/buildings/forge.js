const util = require('util');
const Building = require('./base');
const Warehouse = require('./warehouse');

function Forge(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Forge.super_.apply(this, [{name:'Кузня', prodInterval:5000,production:0,currentCapacity:0}]);

    this.storage = new Warehouse();

    this.result = ['cuirass', 'helmet', 'arms', 'legs', 'sword'];
}

util.inherits(Forge, Building);

/**
 *
 * @returns {boolean}
 */
Forge.prototype.process = function (){

    if (this.workersCount == 0 || this.player.mine.currentCapacity < this.workersCount) {
        this.state = 0;
        return true;
    }

    this.player.mine.currentCapacity -= this.workersCount;
    this.player.mine.start();


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

    var prod =  this.getProduction();
    var i;

    var result = null;

    for (i = 0; i < prod; i++) {
        result = this.result[randomIntInc(0, this.result.length)];
        this.storage.put(result);
    }


    this.addExp(this.productionExp);

    this.player.emit('forgeDone');
};





exports = module.exports = Forge;


function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
