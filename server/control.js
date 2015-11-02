
/*var Queue = require('bull');

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

sendQueue.add({msg:"Hello "});*/
//receiveQueue.add({msg:"World"});

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendfile('index.html');
});

io.on('connection', function(socket){
    console.log('a user connected');
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});