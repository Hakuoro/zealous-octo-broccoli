
var user = function (name){
    this.name = name
};

user.prototype.say = function (word){
    console.log(this.name + ' says ' + word);
};

exports = module.exports = user;