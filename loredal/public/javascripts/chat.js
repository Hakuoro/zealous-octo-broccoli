
    var sock = new SockJS('http://newlke.ru:3000/chat');
    var token = '';
    var player;

    sock.onmessage = function (e) {

        message = JSON.parse(e.data);

        console.log(message);

        if (message.f == 'setT'){
            token = message.token;
        } else if (message.f == 'farmUpdate'){
            document.querySelector('#p1').MaterialProgress.setProgress(message.data.progress*100);
        } else if (message.f == 'resUpdate'){
            document.querySelector('#foodCount').innerHTML = message.data.food;
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

    document.querySelector('#start').onclick = function() {

        var data = {
            f:'start',
            t:token
        };

        sock.send(JSON.stringify(data));
    };