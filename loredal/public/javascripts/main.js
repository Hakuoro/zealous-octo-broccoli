
$(document).ready(function() {

/*
    $(".rival-card").mousedown(function(){

        $(this).removeClass( "mdl-shadow--16dp" );
        $(this).addClass( "mdl-shadow--4dp" );
        $( this ).css( "margin", "5px" );

    });

    $(".rival-card").mouseup(function(){

        $(this).removeClass( "mdl-shadow--4dp" );
        $(this).addClass( "mdl-shadow--16dp" );
        $( this ).css( "margin", "8px" );
    });
*/

    var sock = new SockJS('http://newlke.ru:3000/chat');
    var token = '';
    var player;

    var qs =  document.querySelector;

    sock.onmessage = function (e) {

        message = JSON.parse(e.data);

        console.log(message);

        if (message.f == 'setT'){
            token = message.token;
        } else if (message.f == 'rivalUpdate'){

            //document.querySelector('#p1').MaterialProgress.setProgress((message.data.maxHp - message.data.hp)/message.data.maxHp*100);
            qs('#p1').MaterialProgress.setProgress((message.data.maxHp - message.data.hp)/message.data.maxHp*100);


            document.querySelector('.mdl-card__title-hp').innerHTML = ' ( '+message.data.hp+'/'+message.data.maxHp+' )';

        }else if (message.f == 'killed'){

            document.querySelector('#p1').MaterialProgress.setProgress(100);

        }else if (message.f == 'newRival'){

            document.querySelector('#p1').MaterialProgress.setProgress(0);

            document.querySelector(".mdl-card__title-name").innerHTML = message.data.name;
            document.querySelector(".mdl-card__title-hp").innerHTML = ' ( '+message.data.hp+'/'+message.data.maxHp+' )';


        }else if (message.f == 'playerUpdate'){

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


  /*  $(".rival-card").click(function(){

        var data = {
            f:'startBattle',
            t:token
        };

        sock.send(JSON.stringify(data));

    });*/

});




  /*  document.querySelector('#rival-card').onclick = function() {




        var data = {
            f:'startBattle',
            t:token
        };

        sock.send(JSON.stringify(data));
    };*/