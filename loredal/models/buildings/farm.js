const util = require('util');
const Building = require('./base');

function Farm(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Farm.super_.apply(this, [{name:'Ферма', prodInterval:5000,production:0,currentCapacity:0}]);

    /**
     *  farmer count
     * @type {number}
     */
    this.farmersCount = opts.farmersCount || 0;

    /**
     *  max farmers count
     * @type {number}
     */
    this.maxFarmersCount = opts.maxFarmersCount || 10;
    /**
     *  multiply for calculating production
     * @type {number}
     */
    this.farmerCoeff = opts.farmerCoeff || 1;
}

util.inherits(Farm, Building);

Farm.prototype.toJSON = function (){
    var ret = Farm.super_.prototype.toJSON.apply(this, arguments);

    ret['farmersCount']     = this.farmersCount;
    ret['maxFarmersCount']  = this.maxFarmersCount;
    ret['farmerCoeff']      = this.farmerCoeff;

    return ret;
};

/**
 *
 * @returns {boolean}
 */
Farm.prototype.process = function (){

    console.log('farm processed');
    console.log(this.farmersCount);



    if (this.farmersCount == 0) {
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
    console.log('farm done');
    Farm.super_.prototype.done.apply(this, arguments);
    this.player.emit('farmDone');
};

/**
 *
 * @returns {number}
 */
Farm.prototype.getProduction = function (){

    return this.production * this.count * this.farmersCount * this.farmerCoeff;
};

/**
 *
 * @returns {number}
 */
Farm.prototype.getMaxFarmersCount = function (){

    return this.count * this.maxFarmersCount;
};


exports = module.exports = Farm;