
var user = function (name){
    this.name = name
};

var proto = user.prototype;

proto.say = function (word){
    console.log(this.name + ' says ' + word);
};


proto.update = function (server){


};

exports = module.exports = user;