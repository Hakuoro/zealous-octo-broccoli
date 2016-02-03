
var warehouse = function (){
    //this.player = player;
    this.maxCount = 100;
    this.foodCount = 0;
};

var proto = warehouse.prototype;

proto.getData = function(){
    var data = {
        food:this.foodCount
    };

    return data;
};

proto.addResource = function (type, count){

    if (type == 'food'){
        if (this.foodCount + count < this.maxCount) {
            this.foodCount += count;
        }else{
            this.foodCount = this.maxCount;
        }
    }

};

proto.removeResource = function (type, count){

    if (type == 'food'){
        this.foodCount -= count;
    }


};

exports = module.exports = warehouse;