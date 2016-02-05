
var unit = function (name){
    this.name = name
    this.warehouse = new warehouse(this);
    this.farm = new farm(this);
    this.connection = null;

    this.hp = 100;

};

var proto = player.prototype;

proto.playerData = function (){


    var data = {
        warehouse:this.warehouse.getData(),
        farm:this.farm.getWorkStatus()
    };


    return data;
};


proto.update = function (){

    this.farm.update();
    if (this.farm.isFull()){
        this.warehouse.addResource('food', this.farm.getResourse())
    }
};


proto.say = function (name, data){

    var send = {
        f:name,
        data:data
    };

    this.connection.write(JSON.stringify(send));
};


exports = module.exports = player;