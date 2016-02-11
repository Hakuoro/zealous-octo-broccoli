function Unit(opts){

    this.hp = opts.hp || 100;
    this.maxHp = opts.maxHp || 100;
    this.name = opts.name || "Grog";
    this.exp = opts.exp || 1;
}

module.exports = Unit;

Unit.prototype.getDamage = function (damage){

    this.hp -= damage;


    if (this.hp < 0)
        this.hp = 0;

    return this.hp;
};