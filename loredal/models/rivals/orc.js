//var util = require('util');
var Unit = require('../unit');

function Orc(opts){
    this.hp = opts.hp || 100;
    this.maxHp = opts.maxHp || 100;
    this.name = opts.name || "Grog";
    this.exp = opts.exp || 1;
    this.money = opts.money || 1;
    this.level = opts.level || 1;
}

//util.inherits(Orc, Unit);
Orc.prototype = Object.create(Unit.prototype);

module.exports = Orc;

Orc.prototype.toJSON = function (){

    return {
        hp:Math.ceil(this.hp),
        name:this.name,
        lvl:this.level,
        maxHp:this.maxHp
    };

};