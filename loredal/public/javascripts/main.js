$(document).ready(function() {

    $('.loredal-layout').hide();
    $('.login-div').hide();


    var main = function(playerName){

        var sock = new SockJS('http://loredal.ru:3000/chat');

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

            if (message.f == 'setT') {
                token = message.token;

                Cookies.set('token', token, {expires: 20});
                Cookies.set('name', message.player.name, {expires: 20});

                jq('.login-div').hide();
                jq('.loredal-layout').show();

                setTimeout(function () {
                    sock.send(JSON.stringify({f: 'startAll', t: token}));
                }, 1000);

            } else if (message.f == 'houseDone') {

                var house = message.data;

                houseDone(house);

                if (house.currentCapacity < (house.maxCapacity * house.count)) {

                    setTimeout(function () {
                        sock.send(JSON.stringify({f: 'houseStart', t: token}));
                    }, 1000);
                }

            } else if (message.f == 'houseStarted') {
                houseStarted(message.data);
            } else if (message.f == 'houseUpdate') {
                houseUpdate(message.data)
            } else if (message.f == 'addFarmer') {
                farmUpdate(message.data)
            } else if (message.f == 'farmStarted') {
                farmStarted(message.data)
            } else if (message.f == 'farmUpdate') {
                farmUpdate(message.data)
            } else if (message.f == 'farmDone') {

                var farm = message.data;

                farmDone(farm);

                if (farm.currentCapacity < (farm.maxCapacity * farm.count) && farm.workersCount > 0) {

                    setTimeout(function () {
                        sock.send(JSON.stringify({f: 'farmStart', t: token}));
                    }, 1000);
                }

            } else if (message.f == 'mineUpdate') {
                mineUpdate(message.data)
            } else if (message.f == 'mineDone') {

                var mine = message.data;

                mineDone(mine);

                if (mine.currentCapacity < (mine.maxCapacity * mine.count) && mine.workersCount > 0) {

                    setTimeout(function () {
                        sock.send(JSON.stringify({f: 'mineStart', t: token}));
                    }, 1000);
                }

            } else if (message.f == 'addMiner') {
                mineUpdate(message.data)
            } else if (message.f == 'mineStarted') {
                mineStarted(message.data)
            } else if (message.f == 'addBlacksmith') {
                forgeUpdate(message.data)
            } else if (message.f == 'forgeUpdate') {
                forgeUpdate(message.data)
            } else if (message.f == 'forgeDone') {

                var forge = message.data;

                forgeDone(forge);

                if (forge.currentCapacity < (forge.maxCapacity * forge.count) && forge.workersCount > 0) {

                    setTimeout(function () {
                        sock.send(JSON.stringify({f: 'forgeStart', t: token}));
                    }, 1000);
                }

            } else if (message.f == 'forgeStarted') {
                forgeStarted(message.data)
            }
        };



        $(".farm-card").click(function(){

                var data = {
                    f: 'addWorker',
                    b: 'farm',
                    t: token
                };

                sock.send(JSON.stringify(data));
        });



        $(".mine-card").click(function(){

            var data = {
                f: 'addWorker',
                b: 'mine',
                t: token
            };

            sock.send(JSON.stringify(data));
        });

        $(".forge-card").click(function(){

            var data = {
                f: 'addWorker',
                b: 'forge',
                t: token
            };

            sock.send(JSON.stringify(data));
        });



    };

    var playerUpdate = function(player){

        houseUpdate(player.house);
        farmUpdate(player.farm);

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
            return false;
        });
    }


});