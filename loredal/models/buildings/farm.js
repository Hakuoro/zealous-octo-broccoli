const util = require('util');
const Building = require('./base');

function Farm(player, opts) {
    this.player = player;
    //Building.call(this, {name:'Дом', prodInterval:5000});
    Farm.super_.apply(this, [{name:'Дом', prodInterval:5000,production:0}]);

    this.farmersCount = opts.farmersCount || 0;
}

util.inherits(Farm, Building);

Farm.prototype.toJSON = function (){
    var ret = Farm.super_.prototype.toJSON.apply(this, arguments);

    ret['farmersCount'] = this.farmersCount;

    return ret;
};


Farm.prototype.process = function (){
    this.player.emit('farmStart');
    Farm.super_.prototype.process.apply(this, arguments);
};

Farm.prototype.done = function() {
    Farm.super_.prototype.done.apply(this, arguments);
    this.player.emit('farmDone');
};


exports = module.exports = Farm;