
var Queue = require('bull');

var sendQueue = Queue("Server B", '6379', '127.0.0.1', {auth_pass: '5708Hakuoro!oroukaH8075'});
var receiveQueue = Queue("Server A", '6379', '127.0.0.1', {auth_pass: '5708Hakuoro!oroukaH8075'});


sendQueue.process(function(msg, done){
    console.log("Received message", msg.data);
    done();
});

receiveQueue.process(function(msg, done){
    console.log("Received message", msg.data);
    done();
});

sendQueue.add({msg:"Hello "});
//receiveQueue.add({msg:"World"});