
var farm = function (player){
    this.player = player;
    this.ticksToProcess = 100;
    this.currentTicks = 0;
    this.currentIntervals = 100;
    this.updateRef = null;
    this.resourceToProcess = 1;
    this.processState = 0;
    this.state = 0;
};

var proto = farm.prototype;

proto.update = function (conn){

    if (this.state == 0)
        return 0;

    this.currentTicks ++ ;

    this.player.say('farmUpdate', this.getWorkStatus());

    if (this.currentTicks > this.ticksToProcess){

        this.iAmFull();
        this.stop();
    }

};


proto.getWorkStatus = function(){
    return {
        state:this.state,
        processState:this.processState,
        progress: this.currentTicks/this.ticksToProcess
    };
};

proto.getResourse = function(){

    if (this.isFull()) {
        this.iAmEmpty();
        return this.resourceToProcess;
    }

    return 0;
};


proto.isFull = function(){
    return this.processState;
};

proto.iAmFull = function(){

    this.processState = 1;
};

proto.iAmEmpty = function(){

    this.processState = 0;
};

proto.start = function (){

    if (this.state > 0)
        return true;

    this.state = 1;
    this.currentTicks = 0;
};

proto.stop = function (){

    this.state = 0;
    this.currentTicks = 0;
    clearInterval(this.updateRef);
};

exports = module.exports = farm;