var WebSocket   = require('ws');
var request     = require('request');
var mysql       = require('mysql');
var sleep = require('sleep');

var configPath = process.argv[2] ||  './db.conf.json';

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
trading["720268538_0"] = false;

const ITEM_BOUGHT = 1;
const ITEM_WAITING_PICKUP = 2;
const ITEM_ON_CSTM_BOT = 3;
const ITEM_RETRIVING = 4;
const ITEM_SEND_TRADE = 5;
const ITEM_ON_OUR_BOT = 6;


var ShadowCasePrice = 17.1;
var PhoenixPrice = 1.61;
var Croma2CasePrice = 1.61;
var CromaCasePrice = 1.3;
var FalchionCasePrice = 1.51;

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



setInterval(function() {

    if (!trading["1293508920_0"]) {
       // buyItem('auto shadow case', ShadowCasePrice, "1293508920_0", "7c81317145bd2b86d3c51250ac9f6c9e", false);
    }


    sleep.usleep(1000000);
    if (!trading["926978479_0"]) {
        //buyItem('auto croma 2 case', Croma2CasePrice, "926978479_0", "7e3f6d929be4fde9184e3fa3fd06f5f5", false);
    }


    //sleep.usleep(1000000);
    if (!trading["384801319_0"]) {
      //  buyItem('auto phoenix case', PhoenixPrice, "384801319_0", "24b506a9f9a4ba7f5cc559beaa2f52db", false);
    }

  //  sleep.usleep(1000000);
    if (!trading["991959905_0"]) {
      //  buyItem('auto falshion case', FalchionCasePrice, "991959905_0", "1a46f82e75779d8e97f9875b71ba2ae1", false);
    }

   sleep.usleep(1000000);
    if (!trading["720268538_0"]) {
//        buyItem('auto Chroma Case', CromaCasePrice, "720268538_0", "87f2ab5b83b460193a1253e9048921fb", false);
    }


}, 5000);



wsRegisterHandler("newitem", function(item) {
    if (item.i_classid == '1293508920' && item.ui_price < ShadowCasePrice){

     //   buyItem('shadow case', ShadowCasePrice, "1293508920_0", "7c81317145bd2b86d3c51250ac9f6c9e", true);

    }else if (item.i_classid == '384801319' && item.ui_price < PhoenixPrice){

       // buyItem('phoenix case', PhoenixPrice, "384801319_0", "24b506a9f9a4ba7f5cc559beaa2f52db", true);
    }else if (item.i_classid == '926978479' && item.ui_price < Croma2CasePrice){

       // buyItem('croma 2 case', Croma2CasePrice, "926978479_0", "7e3f6d929be4fde9184e3fa3fd06f5f5", true);
    }else if (item.i_classid == '991959905' && item.ui_price < FalchionCasePrice){

      //  buyItem('auto falshion case', FalchionCasePrice, "991959905_0", "1a46f82e75779d8e97f9875b71ba2ae1", true);
    }else if (item.i_classid == '720268538' && item.ui_price < FalchionCasePrice){

        //buyItem('auto croma case', CromaCasePrice, "720268538_0", "87f2ab5b83b460193a1253e9048921fb", true);
    }

});


setInterval(function() {
    checkRetriveItemsFromCstm();
}, 10000);

/*
setInterval(function() {
    retriveItems();
}, 6000);
*/


function addCsgoItem(id, id_csgo, name, price, status, message, bid){

    var sql = 'INSERT IGNORE INTO csgotm_sales (`id_csgo`, `name`, `price`, `status`, `message`, `bid`) ' +
        'VALUES (?, ?, ?, ?, ?, ?)';


    connection.query({
            sql: sql
        },
        [id_csgo, name, price, status, message, bid],
        function (error, results, fields) {
            if (error){
                console.log("error adding item" + id_csgo);
                console.log(error);
            }
        }
    );
}

wsRegisterHandler("additem_go", function(item) {

    console.log("New Item in inventory " + item.i_name);

    var sql = 'update `csgotm_sales` set `name` = ?, `price` = ?, `status` = ? where id_csgo = ?';

    setTimeout(function() {
        connection.query({
                sql: sql
            },
            [item.i_name, item.ui_price, ITEM_WAITING_PICKUP, item.ui_id],
            function (error, results, fields) {
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
    //console.log(item);
    console.log("Status Changed " + item.id + " Status "+item.status);

    if (item.status == 4 ){
        //{ id: '17860658', status: 4, bid: '237506082', left: 14400 }

        setBidById(item.id, item.bid);
        insertBidQueue(item.bid);

    }else if (item.status == 5 ){
        //{ id: '17860658', status: 5 }
        /*var sql = 'update csgotm_sales set `status` = ?' +
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
        )*/
    }

});


function checkRetriveItemsFromCstm(){


    var url = "https://csgo.tm/api/Trades/?key="+config.apiKey;

    request(url, function (error, response, body) {

        try {
            var json = JSON.parse(body);
            //{"result":"ok","id":"16159858"}
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON555: '+body);
            return;
        }
        json.some(function (item, index, array) {

            if (item.ui_status == 4) {
                //insertBid(item);
                retriveItem(item.ui_bid);
                return true;
            }

            return false;
        });

    });
}


function insertBid(item){

    connection.query({
            sql: 'select * from csgotm_sales where id_csgo = ? '
        },
        [item.ui_id],
        function (error, results, fields) {
            if (error){
                console.log(error);
            }else{
                if (results.length == 0) {
                    // пытаемся добавить вещь, если она по стечению обстоятельст не появилась в нашей базе
                    addCsgoItem(0, item.ui_id, item.i_market_hash_name, item.ui_price, ITEM_ON_CSTM_BOT, '', item.ui_bid);
                    insertBidQueue(item.ui_bid);
                }else if (results[0].status < ITEM_ON_CSTM_BOT){
                    insertBidQueue(item.ui_bid);
                    connection.query({
                            sql: 'update csgotm_sales set bid = ?, status = ?, price= ?, name = ?, purchase_time = NOW()' +
                            ' where id_csgo = ?'
                        },
                        [item.ui_bid, ITEM_ON_CSTM_BOT, item.ui_price, item.i_market_hash_name, item.ui_id],
                        function (error, results, fields) {
                            if (error){
                                console.log(sql);
                                console.log(error);
                            }

                        }
                    );

                }
            }
        }
    );
}

function retriveItem(ui_bid){

    var url = "https://csgo.tm/api/ItemRequest/out/"+ui_bid+"/?key="+config.apiKey;

    console.log('retrive item ' + ui_bid);
    updateBid(ui_bid, ITEM_RETRIVING);
    request(url, function (error, response, body) {

        try {
            var json = JSON.parse(body);
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON666: '+body);
            return true;
        }

        if (json.success == true){

            var sql = 'update csgotm_sales set `message` = ?, status = ?' +
                ' where bid = ?';

            connection.query({
                    sql: sql
                },
                [json.secret, ITEM_SEND_TRADE, ui_bid],
                function (error, results, fields) {
                    if (!error){
                    }else{
                        console.log(sql);
                        console.log(error);
                    }
                }
            );

            console.log("Retrive ok "+ui_bid)
            updateBid(ui_bid, ITEM_SEND_TRADE);
        }else{
            console.log(json.error);
            if (json.error == 'Ошибка создания заявки: Нет предметов для вывода') {
                setStatusByBid(ui_bid, ITEM_ON_OUR_BOT);
                updateBid(ui_bid, ITEM_ON_OUR_BOT);
            }else{
                setStatusByBid(ui_bid, ITEM_ON_CSTM_BOT);
                updateBid(ui_bid, ITEM_ON_CSTM_BOT);
            }
        }
    });
}

function retriveItems(){

    var sql = 'select bid from cs_bids where status = ? and lastsave < NOW() - INTERVAL 30 SECOND LIMIT 1';
    connection.query({
            sql: sql
        },
        [ITEM_ON_CSTM_BOT],
        function (error, results, fields) {
            if (error){
                console.log(error);
            }else{
                if (results.length > 0) {
                    results.forEach(function (item, index) {

                        setStatusByBid(item.bid,ITEM_RETRIVING);
                        retriveItem(item.bid);
                    });
                }
            }
        }
    );

}


function insertBidQueue(bid){
    connection.query({
            sql:'INSERT INTO cs_bids (`bid`, `lastsave`, `status`) VALUES (?, NOW(), ?) ON DUPLICATE KEY UPDATE `lastsave` = NOW()'
        },
        [bid, ITEM_ON_CSTM_BOT],
        function (error, results, fields) {
            if (!error){
                console.log('bid set '+bid);
            }else{
                console.log(error);
            }
        }
    );
}



function updateBid(bid, status){
    connection.query({
            sql:'Update cs_bids set `status` = ?, lastsave = NOW() where `bid` = ?'
        },
        [status, bid],
        function (error, results, fields) {
            if (!error){
                console.log('bid set '+bid);
            }else{
                console.log(error);
            }
        }
    );
}

function setBidById(id, bid){
    connection.query({
            sql:'update csgotm_sales set bid=?, status = ? where id_csgo = ?'
        },
        [bid, ITEM_ON_CSTM_BOT, id],
        function (error, results, fields) {
            if (!error){
                console.log('bid set '+id);
            }else{
                console.log(sql);
                console.log(error);
            }
        }
    );
}

function setStatusByBid(bid, status){
    connection.query({
            sql:'update csgotm_sales set status = ? where bid = ?'
        },
        [status, bid],
        function (error, results, fields) {
            if (!error){
                console.log('status set '+bid+' '+status);
            }else{
                console.log(sql);
                console.log(error);
            }
        }
    );
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
                addCsgoItem(0, json.id, '', '', ITEM_BOUGHT, '', 0);
            }else{
                console.log(json.result);
                if (json.result == 'К сожалению, предложение устарело. Обновите страницу') {
                    console.log('stop trading '+inst);
                    trading[inst] = true;
                }
            }

        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON111: '+body + ' '+e.message);
            return;
        }

        if (setTrading)
            trading[inst] = false;

    });


}

/*********************************************************************************************************************/
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
                    wsDoLog('Requested token doesn\'t look like a valid JSON222: '+json);
                    return;
                }
            });

            return;
        }



        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON333: '+message.data);
            return;
        }

        try {
            var data = JSON.parse(json.data);
        } catch (e) {
            wsDoLog('This doesn\'t look like a valid JSON444: '+json.data);
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