//var util = require('util');
var Unit = require('../unit');

function Orc(opts){
    this.hp = opts.hp || 100;
    this.maxHp = opts.maxHp || 100;
    this.name = opts.name || "Grog";
}

//util.inherits(Orc, Unit);
Orc.prototype = Object.create(Unit.prototype);

module.exports = Orc;

Orc.prototype.toJSON = function (){

    return {
        hp:this.hp,
        maxHp:this.maxHp
    };

};