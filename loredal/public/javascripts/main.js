
$(document).ready(function() {

    $('.loredal-layout').hide();
    $('.login-div').hide();


    var main = function(playerName){

        var sock = new SockJS('http://newlke.ru:3000/chat');

        var state = 0;
        var token = null;


        var jq =  $;

        sock.onopen = function (e) {
            var data = {
                f:'initPlayer'
            };
            if (token = Cookies.get('token')){
                data['name'] = Cookies.get('name');
            }else{
                data['name'] = playerName;
            }

            sock.send(JSON.stringify(data));
        };

        sock.onclose = function (e) {
            //alert("close");
        };

        sock.onmessage = function (e) {

            message = JSON.parse(e.data);

            var battleCounter,
            battleUpdate,
            progressUpdate,
            progress, rival, battleTurn, battleTime;

            console.log(message);

            if (message.f == 'setT'){
                token = message.token;

                Cookies.set('token', token, { expires: 20 });
                Cookies.set('name', message.player.name, { expires: 20 });

                jq('.login-div').hide();
                jq('.loredal-layout').show();

                playerUpdate(message.player);

            } else if (message.f == 'rivalUpdate'){

                document.querySelector('#p1').MaterialProgress.setProgress((message.data.maxHp - message.data.hp)/message.data.maxHp*100);
                jq('.mdl-card__title-hp').text(' ( '+message.data.hp+'/'+message.data.maxHp+' )');
                //jq(".mdl-card__title-name").text(message.data.name);

            }else if (message.f == 'killed'){
                clearInterval(battleTurn);
                state = 0;
                jq(".rival-card-active").toggleClass("mdl-shadow--8dp").toggleClass("mdl-shadow--4dp").removeClass("rival-card-active");
                document.querySelector('#p1').MaterialProgress.setProgress(0);
                progress = 0;
            }else if (message.f == 'newRival'){

                document.querySelector('#p1').MaterialProgress.setProgress(0);

                rival = message.data;

                jq(".mdl-card__title-name").text(rival.name);
                jq(".mdl-card__title-hp").text(' ( ' + rival.maxHp + ' )');

            }else if (message.f == 'playerUpdate'){
                playerUpdate(message.data);
            }else if (message.f == 'startBattle'){

                state = 1;

                var battleProgress = document.querySelector('#p1');

                battleProgress.MaterialProgress.setProgress(0);

                battleUpdate = 1000;

                rival = message.data.rival;
                battleTime = message.data.battleTime - battleUpdate;

                jq(".mdl-card__title-name").text(rival.name);

                battleCounter = 0;

                progressUpdate = battleUpdate/battleTime*100;
                progress = 0;

                battleTurn = setInterval(function(){
                    if(battleCounter <= battleTime) {
                        battleCounter += battleUpdate;
                        progress += progressUpdate;
                        battleProgress.MaterialProgress.setProgress(progress);
                    } else {
                        clearInterval(battleTurn);
                        state = 0;
                        document.querySelector('#p1').MaterialProgress.setProgress(0);
                        progress = 0;
                    }
                }, battleUpdate);
            }
        };


        $(".rival-card").click(function(){

            if (state == 0) {

                jq(this).toggleClass("mdl-shadow--8dp").toggleClass("mdl-shadow--4dp").addClass("rival-card-active");

                var data = {
                    f: 'startBattle',
                    t: token
                };

                sock.send(JSON.stringify(data));
            }
        });





    };

    var playerUpdate = function(player){

        $('.player-name').text(player.name);
        $('.player-level').text(player.level);
        $('.player-dps').text(player.dps);
        $('.player-click').text(player.clickDamage);

        document.querySelector('.player-exp').MaterialProgress.setProgress(player.exp/player.needExp*100);
    };



    if (Cookies.get('token')){
        $('.loredal-layout').show();
        main('');
    }else{
        $('.login-div').show();
        $(".enter-button").click(function(){
            var playerName = $("#playerName").val();
            if (playerName){
                main(playerName);
            }
        });
    }




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