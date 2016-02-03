var warehouse = require('./warehouse');
var farm = require('./farm');

var player = function (name){
    this.name = name
    this.warehouse = new warehouse();
    this.farm = new farm();
};

var proto = player.prototype;

proto.playerData = function (){


    var data = {
        warehouse:this.warehouse.getData(),
        farm:this.farm.getWorkStatus()
    };


    return data;
};


proto.update = function (server){

    this.farm.update();
    if (this.farm.isFull()){
        this.warehouse.addResource('food', this.farm.getResourse())
    }


};

exports = module.exports = player;