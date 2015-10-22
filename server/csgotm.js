var WebSocket   = require('ws');
var request     = require('request');
var mysql       = require('mysql');
var sleep = require('sleep');

var configPath = process.argv[2] || process.env.APP_CONFIG_PATH || './db.conf.json';

var config = require(configPath);

var wsAddress = config.wsAddress;
var wsAuthApi = config.wsAuthApi;
var wsPath = config.wsPath;
var PATH = "/";


var ws_handlers = [];
var ws_connection = null;
var ws_worker = null;
var ws_connected = false;
var ws_subscr_to_add = [];
var ws_timeout = null;
var ws_error_num = 0;
var ws_error_limit = 5;
var ws_unsupported_error_reported = false;
var ws_auth_errors = 0;
var ws_connection_type = 1;
var connected = false;
var trading = {} ;


trading["1293508920_0"] = false;
trading["384801319_0"] = false;
trading["926978479_0"] = false;
trading["991959905_0"] = false;


var ShadowKeyPrice = 25;
var PhoenixPrice = 0.71;
var Croma2CasePrice = 2;
var FalchionCasePrice = 0.71;

wsSubscribe("auth:82118763.1444641436.17701e21f5a9510117f4a0c02497103c35653436");
wsSubscribe("newitems");
wsSubscribe("additem_go");
wsSubscribe("itemout_new_go");
wsSubscribe("itemstatus_go");


var connection = mysql.createConnection({
    host     : config.host,
    user     : config.user,
    password : config.password,
    database : config.database
});


connection.connect(function(err){
    if(!err) {
        connected = true;
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

setInterval(function() {

    if (!trading["1293508920_0"]) {
        buyItem('auto shadow case', ShadowKeyPrice, "1293508920_0", "d237e8e89ac6173e7335f76e33e8afbd", false);
    }


    sleep.usleep(1000000);
    if (!trading["926978479_0"]) {
        buyItem('auto croma 2 case', Croma2CasePrice, "926978479_0", "7e3f6d929be4fde9184e3fa3fd06f5f5", false);
    }


    sleep.usleep(1000000);
    if (!trading["384801319_0"]) {
        buyItem('auto phoenix case', PhoenixPrice, "384801319_0", "24b506a9f9a4ba7f5cc559beaa2f52db", false);
    }

    sleep.usleep(1000000);
    if (!trading["991959905_0"]) {
        buyItem('auto falshion case', FalchionCasePrice, "991959905_0", "1a46f82e75779d8e97f9875b71ba2ae1", false);
    }




}, 5000);

setInterval(function() {
    checkRetriveItems();
}, 20000);

wsRegisterHandler("newitem", function(item) {
    if (item.i_classid == '1293508920' && item.ui_price < ShadowKeyPrice){

        buyItem('shadow case', ShadowKeyPrice, "1293508920_0", "d237e8e89ac6173e7335f76e33e8afbd", true);

    }else if (item.i_classid == '384801319' && item.ui_price < PhoenixPrice){

        buyItem('phoenix case', PhoenixPrice, "384801319_0", "24b506a9f9a4ba7f5cc559beaa2f52db", true);
    }else if (item.i_classid == '926978479' && item.ui_price < Croma2CasePrice){

        buyItem('croma 2 case', Croma2CasePrice, "926978479_0", "7e3f6d929be4fde9184e3fa3fd06f5f5", true);
    }else if (item.i_classid == '991959905' && item.ui_price < FalchionCasePrice){

        buyItem('auto falshion case', FalchionCasePrice, "991959905_0", "1a46f82e75779d8e97f9875b71ba2ae1", true);
    }



});



//additem_go - добавление предмета на странице sell.
//    itemout_new_go - Исчезание предмета на странице sell.
//    itemstatus_go - Изменение статуса предмета на странице sell.

/*https://csgo.tm/api/ItemRequest/[in_or_out]/[botid]/?key=[your_secret_key] - Отправка оффлайн трейда от нашего бота вам.

    [in_or_out] = Отправляем "out", если хотим вывести купленную вещь, "in" - если хотим передать боту продаваемую вещь.
    [botid] - При выводе купленной вещи, вы можете посмотреть этот id в свойствах предмета со страницы sell (api /Trades/)
    [botid] = 1 - При передаче продаваемой вещи нашему боту, вместо [botid] передайте просто "1"
*/

function addCsgoItem(id, id_csgo, name, price, status, message){

    var sql = 'INSERT INTO csgotm_sales (`id_csgo`, `name`, `price`, `status`, `message`) ' +
        'VALUES (?, ?, ?, ?, ?)';

        connection.query({
                sql: sql
            },
            [id_csgo, name, price, status, message],
            function (error, results, fields) {
                if (!error){
                    console.log("adding item complete " + id_csgo);
                }else{
                    console.log("error adding item" + id_csgo);
                }
            }
        );
}
/*
New Item in inventory 16200363
Store info complete 16200363
Buy Ok, Store data!
    adding item complete 16200363
*/


wsRegisterHandler("additem_go", function(item) {

    console.log("New Item in inventory " + item.i_name);

    var sql = 'update `csgotm_sales` set `name` = "'+item.i_name+'", `price` = '+item.ui_price+', `status` = 1 ' +
        ' where id_csgo = '+item.ui_id;

    setTimeout(function() {
        connection.query(sql, function (error, results, fields) {
                if (!error){
                    console.log("Store info complete " + item.i_name + ' ' + item.ui_price);
                }else{
                    console.log("error store info" + item.ui_id);
                }
            }
        );

    }, 8000);
});


wsRegisterHandler("itemstatus_go", function(item) {
    console.log("Status Changed " + item.id + " Status "+item.status);

    if (item.status == 4 ){
        var url = "https://csgo.tm/api/ItemRequest/out/"+item.bid+"/?key="+config.apiKey;

        console.log("Retrive item "+item.id);

        request(url, function (error, response, body) {

            try {
                var json = JSON.parse(body);
                //{"result":"ok","id":"16159858"}
            } catch (e) {
                wsDoLog('This doesn\'t look like a valid JSON: '+body);
                return;
            }

            console.log("Retrive item response: "+item.id);
            if (json.success == true){

                var sql = 'update csgotm_sales set `message` = ?' +
                    ' where id_csgo = ?';

                connection.query({
                        sql: sql
                    },
                    [json.secret, item.id],
                    function (error, results, fields) {
                        if (!error){
                        }else{
                            console.log(sql);
                            console.log(error);
                        }
                    }
                );

                console.log("Retrive ok "+item.id)

            }else{
                console.log(json.error);
            }
        });

    }else if (item.status == 5 ){
        var sql = 'update csgotm_sales set `status` = 2' +
            ' where id_csgo = ?';
        connection.query({
                sql: sql
            },
            [item.id],
            function (error, results, fields) {

                if (!error){
                    console.log("Save OK");
                }else{
                    console.log(sql);
                    console.log(error);
                }
            }
        )
    }

});

function checkRetriveItems(){


    var url = "https://csgo.tm/api/Trades/?key="+config.apiKey;

    request(url, function (error, response, body) {

        try {
            var json = JSON.parse(body);
            //{"result":"ok","id":"16159858"}
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON: '+body);
        }

        var id_item = 0, ui_bid = 0;

        json.every(function(item) {
            if (item.ui_status == 4) {
                id_item = item.ui_id;
                ui_bid = item.ui_bid;
                return false;
            }
            return true;
        });


        if (id_item > 0){
            retriveItem(id_item, ui_bid);
        }

    });
}

function retriveItem(id_item, ui_bid){


    var url = "https://csgo.tm/api/ItemRequest/out/"+ui_bid+"/?key="+config.apiKey;

    console.log("Auto Retrive item "+id_item);

    request(url, function (error, response, body) {

        try {
            var json = JSON.parse(body);
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON: '+body);
            return true;
        }

        console.log("Retrive item response: "+id_item);
        if (json.success == true){

            var sql = 'update csgotm_sales set `message` = ?' +
                ' where id_csgo = ?';

            connection.query({
                    sql: sql
                },
                [json.secret, id_item],
                function (error, results, fields) {
                    if (!error){
                    }else{
                        console.log(sql);
                        console.log(error);
                    }
                }
            );

            console.log("Retrive ok "+id_item)
        }else{
            console.log(json.error);
        }
    });
}





function buyItem( name, price, inst, hash, setTrading){

    var url = "https://csgo.tm/api/Buy/"+inst+"/"+(price * 100)+"/"+hash+"/?key="+config.apiKey;

    console.log("Request buy "+name+": " + price);

    if (setTrading)
        trading[inst] = true;

    request(url, function (error, response, body) {

        try {
            var json = JSON.parse(body);
            if (json.id != false){
                console.log("Buy Ok");
                addCsgoItem(0, json.id, '', 0, 0, '');
            }else{
                console.log(json.result);
                trading[inst] = true;
            }

        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON: '+body);
        }

        if (setTrading)
            trading[inst] = false;

    });


}


function wsIsConnected() {
    return ws_connected;
}

function wsDoLog(text) {
    console.log(text);
}

function wsRegisterHandler(type, handler) {
    wsConnect();
    ws_handlers.push({"type": type, "handler": handler});
}

function wsError(text, id) {
    console.log(text + ' '+id);
}

function wsClearError(id) {
}

function wsSubscribe(id) {
    if(ws_connected) {
        if(ws_connection_type == 1)
            ws_connection.send(id);
        else if(ws_connection_type == 2)
            ws_worker.port.postMessage(id);
    }

    for(var i in ws_subscr_to_add)
        if( ws_subscr_to_add[i] == id)
            return;
    ws_subscr_to_add.push(id);
}

function wsConnect() {
    return  wsSyncConnect();
}


function wsSyncConnect() {
    if(ws_connection != null)
        return ws_connection;

    wsDoLog("Sync connection");
    ws_connection = new WebSocket(wsAddress);

    /*var pinger = setInterval(function () {
        if(ws_connected && ws_connection)
            ws_connection.send("ping");
    }, 3000);*/

    ws_connection.onopen = function () {
        ws_error_num = 0;
        ws_auth_errors = 0;
        ws_connected = true;
        var id;
        for(var i in ws_subscr_to_add)
            ws_connection.send(ws_subscr_to_add[i]);

        wsClearError("ws_error");
        wsDoLog("Sync connection open");
    };

    ws_connection.onclose = function() {
        ws_error_num++;
        ws_connected = false;
        delete ws_connection;
        ws_connection = null;
    }

    ws_connection.onmessage = function (message) {

        if(message.data == "pong") {
            wsClearError("ws_error");
            return;
        }

        if(message.data == "auth") {
            ws_auth_errors++;
            if(ws_auth_errors > 5) {
                wsError("Unable to subscribe to your private messages. You might log off from the site.");
                return;
            }
            wsDoLog('Auth token is invalid! Requesting new...');

            request(wsAuthApi, function (error, response, body) {

                try {
                    var json = JSON.parse(body);
                    if(json.wsAuth) {
                        wsDoLog('Authenticated');
                        ws_connection.send(json.wsAuth);
                    } else
                        wsDoLog('Server did not respond with auth token: '+json);
                } catch (e) {
                    wsDoLog('Requested token doesn\'t look like a valid JSON: '+json);
                }
            });

            return;
        }



        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON: '+message.data);
            return;
        }

        try {
            var data = JSON.parse(json.data);
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON: '+json.data);
            return;
        }


        for(var i in ws_handlers)
            if(ws_handlers[i].type == json.type) {
                var handler = ws_handlers[i].handler;
                try {
                    handler(data);
                } catch (e) {
                    wsDoLog('Handler failed: '+e);
                }
            }

    };

}