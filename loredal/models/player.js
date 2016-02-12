var util = require('util');
var Unit = require('./unit');
var Orc = require('./rivals/orc');

function Player (opts){
    this.name = opts.name || "Boris";
    this.connection = null;

    this.maxHp = 100;
    this.hp = 100;

    this.currentRival = null;

    this.state = 0;

    // auto attack
    this.dps = 10;

    // click attack
    this.clickDamage = 10;

    this.interval = 100;

    this.exp = 0;

    this.level = 1;

}

util.inherits(Player, Unit);

module.exports = Player;

Player.prototype.init = function (opts){

    this.setConnection(opts.conn);

    this.findRival();
};


Player.prototype.update = function (){


    if (this.state == 1 && this.currentRival){

        var rivalHp = this.currentRival.getDamage(this.damage());

        if (rivalHp == 0){
            // кирдык
            this.state = 0;
            this.killedRival();
            this.say('killed', {});
        }else{

            this.say('rivalUpdate', this.currentRival.toJSON());
        }

        return true;

    }


    if (this.state  == 0 || !this.currentRival){
        this.findRival();
    }
};

Player.prototype.startBattle = function (){

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

        this.say('rivalUpdate', this.currentRival.toJSON());
    }

};

Player.prototype.killedRival = function (){

    this.addExp()
    this.findRival();

};

Player.prototype.addExp = function (){

};

Player.prototype.damage = function (){
    return this.dps * (this.interval/1000);
};

Player.prototype.toJSON = function (){

    return {
        hp:this.hp,
        maxHp:this.maxHp,
        currentRivals:this.currentRival?this.currentRival.toJSON():{}
    };

};

Player.prototype.setConnection = function (connection){
    this.connection = connection;
};


Player.prototype.findRival = function (){
    this.currentRival = new Orc({name:"Borg"});
    this.say('newRival', this.currentRival.toJSON());

    this.state = 1;
};


Player.prototype.say = function (name, data){

    var send = {
        f:name,
        data:data
    };

    this.connection.write(JSON.stringify(send));
};