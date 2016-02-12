
    var sock = new SockJS('http://newlke.ru:3000/chat');
    var token = '';
    var player;

    sock.onmessage = function (e) {

        message = JSON.parse(e.data);

        console.log(message);

        if (message.f == 'setT'){
            token = message.token;
        } else if (message.f == 'rivalUpdate'){
            document.querySelector('#p1').MaterialProgress.setProgress((message.data.maxHp - message.data.hp)/message.data.maxHp*100);
            document.querySelector('.mdl-card__title-hp').innerHTML = ' ( '+message.data.hp+'/'+message.data.maxHp+' )';
        }else if (message.f == 'killed'){
            document.querySelector('#p1').MaterialProgress.setProgress(100);
        }else if (message.f == 'newRival'){
            document.querySelector('.mdl-card__title-name').innerHTML = message.data.name;
            document.querySelector('.mdl-card__title-hp').innerHTML = ' ( '+message.data.hp+'/'+message.data.maxHp+' )';
            document.querySelector('#p1').MaterialProgress.setProgress(0);
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
            f:'startBattle',
            t:token
        };

        sock.send(JSON.stringify(data));
    };