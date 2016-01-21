var sock = new SockJS('http://newlke.ru:3000/chat');
var token = '';

function ChatCtrl($scope) {
    $scope.messages = [];

    sock.onmessage = function (e) {

        message = JSON.parse(e.data);

        if (message.f == 'getT'){
            token = message.token;
            console.log(token);
        }

    };

    sock.onclose = function (e) {
        //alert("close");
    };

    sock.onopen = function (e) {

        var data = {
          f:'getT'
        };

        sock.send(JSON.stringify(data));

    };
}
