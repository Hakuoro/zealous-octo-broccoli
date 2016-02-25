
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

            var state, houseCounter,
            houseUpdate,
            progressUpdate,
            progress, houseTurn, houseTime;

            console.log(message);

            if (message.f == 'setT'){
                token = message.token;

                Cookies.set('token', token, { expires: 20 });
                Cookies.set('name', message.player.name, { expires: 20 });

                jq('.login-div').hide();
                jq('.loredal-layout').show();

                playerUpdate(message.player);

            }else if (message.f == 'houseUpdate'){

            }else if (message.f == 'houseStart'){

                state = 1;

                var houseProgress = document.querySelector('.house-progress').MaterialProgress;
                var farm = message.data;

                houseProgress.setProgress(0);

                houseUpdate = 1000;

                houseTime = farm.prodInterval - farm.currentProduction;

                houseCounter = 0;

                progressUpdate = houseUpdate/houseTime*100;
                progress = 0;

                houseTurn = setInterval(function(){
                    if(houseCounter <= houseTime) {
                        houseCounter += houseUpdate;
                        progress += progressUpdate;
                        houseProgress.setProgress(progress);
                    } else {
                        clearInterval(houseTurn);
                        state = 0;
                        houseProgress.setProgress(0);
                        progress = 0;
                    }
                }, houseUpdate);
            }
        };


       /* $(".rival-card").click(function(){

            if (state == 0) {

                jq(this).toggleClass("mdl-shadow--8dp").toggleClass("mdl-shadow--4dp").addClass("rival-card-active");

                var data = {
                    f: 'starthouse',
                    t: token
                };

                sock.send(JSON.stringify(data));
            }
        });*/





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