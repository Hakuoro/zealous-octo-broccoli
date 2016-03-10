const util = require('util');
const Building = require('./base');
const Warehouse = require('./warehouse');

function Forge(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Forge.super_.apply(this, [{name:'Кузня', prodInterval:5000,production:0,currentCapacity:0}]);

    this.warehouse = new Warehouse();

    this.result = ['cuirass', 'helmet', 'arms', 'legs', 'sword'];

    this.resultCounter = 0;
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
    Forge.super_.prototype.process.apply(this, arguments);
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

    this.warehouse.put(this.result[this.resultCounter]);


    this.resultCounter ++;

    if (this.resultCounter >= this.result.length) {
        this.resultCounter = 0;
    }

    this.addExp(this.productionExp);

    this.player.emit('forgeDone');
};

Forge.prototype.toJSON = function(name) {

    var data = Forge.super_.prototype.toJSON.apply(this, arguments);

    data['warehouse'] = this.warehouse.toJSON();

    return data;
};

exports = module.exports = Forge;