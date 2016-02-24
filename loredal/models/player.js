var util = require('util');
var Unit = require('./unit');
var Orc = require('./rivals/orc');

function Player (opts){
    this.name = opts.name || "Boris";
    this.connection = null;

    this.maxHp = opts.maxHp || 100;
    this.hp = opts.hp || 100;

    this.currentRival = null;

    this.state = 0;

    // auto attack
    this.dps = opts.dps || 10;

    // click attack
    this.clickDamage = opts.clickDamage || 10;

    this.interval = 100;

    this.exp = opts.exp || 0;

    this.level = opts.level || 1;

    this.needExp = opts.needExp || 10;

    this.expMult = .12;

    this.damageMult = .1;

}

util.inherits(Player, Unit);

module.exports = Player;

Player.prototype.init = function (opts){

    this.setConnection(opts.conn);

    this.findRival();
    this.say('playerUpdate', this.toJSON());
};

Player.prototype.levelUp = function (){

    this.exp = 0;

    this.needExp +=  Math.ceil(this.needExp * this.expMult);

    this.dps += Math.floor(this.dps * this.damageMult);

    this.clickDamage += Math.floor(this.clickDamage * this.damageMult);

    this.level ++;
};

Player.prototype.startBattle = function (){

    console.log(this.state);
    if (this.state  != 0 ){
        return true;
    }

    if (!this.currentRival){
        this.findRival();
    }

    this.state = 1;

    var battleTime = Math.floor(this.currentRival.hp / this.dps * 1000) ;

    this.say('startBattle', {
        battleTime:battleTime,
        rival:this.currentRival.toJSON()
    });

    var self = this;

    var battleTimer = setTimeout(function () {

        self.state = 0;
        self.killedRival();
        self.say('killed', {});

    }, battleTime );

};

Player.prototype.damageRival = function (){

    if (this.state  != 1 || !this.currentRival){
        return true;
    }

    var rivalHp = this.currentRival.getDamage(this.clickDamage);

    if (rivalHp == 0){
        // кирдык
        this.state = 0;
        this.killedRival();
        this.say('killed', {});
    }else{

        this.say('rivalUpdate', this.toJSON());
    }

};


Player.prototype.killedRival = function (){

    this.addExp();
    this.findRival();
};

Player.prototype.addExp = function (){
    this.exp += this.currentRival.exp;

    if (this.exp >= this.needExp){

        this.levelUp();
    }

    this.say('playerUpdate', this.toJSON());
};

Player.prototype.damage = function (){
    return this.dps * (this.interval/1000);
};

Player.prototype.setConnection = function (connection){
    this.connection = connection;
};


Player.prototype.findRival = function (){
    this.currentRival = new Orc({name:"Borg"});
    this.say('newRival', this.currentRival.toJSON());
    //this.state = 1;
};


Player.prototype.say = function (name, data){

    var send = {
        f:name,
        data:data
    };

    this.connection.write(JSON.stringify(send));
};

Player.prototype.toJSON = function (){

    return {
        name:this.name,
        hp:this.hp,
        maxHp:this.maxHp,
        currentRivals:this.currentRival?this.currentRival.toJSON():{},
        exp:this.exp,
        needExp:this.needExp,
        dps:this.dps,
        clickDamage:this.clickDamage,
        level:this.level
    };

};