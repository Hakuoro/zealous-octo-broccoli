$(document).ready(function() {

    $('.loredal-layout').hide();
    $('.login-div').hide();


    var main = function(playerName){

        var sock = new SockJS('http://newlke.ru:3000/chat');

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

            console.log(message);

            if (message.f == 'setT'){
                token = message.token;

                Cookies.set('token', token, { expires: 20 });
                Cookies.set('name', message.player.name, { expires: 20 });

                jq('.login-div').hide();
                jq('.loredal-layout').show();

                setTimeout(function(){
                    sock.send(JSON.stringify({f:'startAll', t:token}));
                }, 1000);

            }else if (message.f == 'houseDone'){

                var house = message.data;

                houseDone(house);

                if (house.currentCapacity  < (house.maxCapacity*house.count)){

                    setTimeout(function(){
                        sock.send(JSON.stringify({f:'houseStart', t:token}));
                    }, 1000);
                }

            }else if (message.f == 'houseStarted'){
                houseStart(message.data);
            }else if (message.f == 'addFarmer'){
                farmUpdate(message.data)
            }else if (message.f == 'farmStarted'){
                farmStart(message.data)
            }else if (message.f == 'farmDone'){

                var farm = message.data;

                farmDone(farm);

                if (farm.currentCapacity  < (farm.maxCapacity*farm.count) && farm.farmersCount > 0){

                    setTimeout(function(){
                        sock.send(JSON.stringify({f:'farmStart', t:token}));
                    }, 1000);
                }

            }
        };



        $(".farm-card").click(function(){

                var data = {
                    f: 'addFarmer',
                    t: token
                };

                sock.send(JSON.stringify(data));
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