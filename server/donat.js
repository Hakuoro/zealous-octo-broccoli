var fs = require('fs');
var crypto = require('crypto');
var Steam = require('steam');
var SteamWebLogOn = require('steam-weblogon');
var getSteamAPIKey = require('steam-web-api-key');
var SteamTradeOffers = require('steam-tradeoffers');

var mysql       = require('mysql');

// Put your 64-bit SteamID here so the bot can accept your offers
var configPath = process.argv[2] || process.env.APP_CONFIG_PATH || './bot.conf.json';

var dbConfPath = process.argv[3] || './db.conf.json';
var dbConf = require(dbConfPath);


var connection = mysql.createConnection({
    host     : dbConf.host,
    user     : dbConf.user,
    password : dbConf.password,
    database : dbConf.database
});


connection.connect(function(err){
    if(!err) {
        connected = true;
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});



/**
 *  метрика подключения ботов
 * @type {*}
 */
var logOnOptions = require(configPath);


var admin = "76561198042384491";

/**
 * код для авторизации бота
 * @type {string}
 */
var authCode = '2P9QG'; // Code received by email

/**
 *  включена ли отдача предметов
 * @type {boolean}
 */
var give = false;

/**
 *  список ботов которым разрешено отдавать предметы
 * @type {{}}
 */
var bots = {};

/**
 *  файл для сохранения списка ботов
 * @type {string}
 */
var botIdsFile = './opskins.bot';



var sentryFileName = 'sentry77'; // steam guard data file name

try {
    logOnOptions.sha_sentryfile = getSHA1(fs.readFileSync(sentryFileName));
} catch (e) {
    if (authCode !== '') {
        logOnOptions.auth_code = authCode;
    }
}

if (fs.existsSync('servers')) {
    Steam.servers = JSON.parse(fs.readFileSync('servers'));
}

if (fs.existsSync(botIdsFile)) {
    bots = JSON.parse(fs.readFileSync(botIdsFile));
}

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);
var steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
var offers = new SteamTradeOffers();

steamClient.connect();
steamClient.on('connected', function() {
    steamUser.logOn(logOnOptions);
});

steamClient.on('logOnResponse', function(logonResp) {
    if (logonResp.eresult === Steam.EResult.OK) {
        console.log('Logged in!');
        steamFriends.setPersonaState(Steam.EPersonaState.Online);

        steamWebLogOn.webLogOn(function(sessionID, newCookie) {
            getSteamAPIKey({
                sessionID: sessionID,
                webCookie: newCookie
            }, function(err, APIKey) {

                // handle offers
                offers.setup({
                    sessionID: sessionID,
                    webCookie: newCookie,
                    APIKey: APIKey
                }, function () {
                    handleOffers();

                    /*offers.loadMyInventory({
                        appId: 730,
                        contextId:2
                    }, loadMyBags)*/
                });




            });
        });
    }
});

steamClient.on('servers', function(servers) {
    fs.writeFile('servers', JSON.stringify(servers));
});

steamUser.on('updateMachineAuth', function(sentry, callback) {
    fs.writeFileSync(sentryFileName, sentry.bytes);
    callback({ sha_file: getSHA1(sentry.bytes) });
});

steamUser.on('tradeOffers', function(number) {
    if (number > 0) {
        handleOffers();
    }
});


function loadMyBags($vara, $bags){

    console.log($bags);
}

setInterval(function() {
    saveBots()
}, 60000);

function saveBots(){
    fs.writeFile(botIdsFile, JSON.stringify(bots), function(err) {
        if(err) {
            console.log(err);
        } else {
            console.log("Bots saved!");
        }
    });
}

function handleOffers() {
    offers.getOffers({
        get_received_offers: 1,
        active_only: 1,
        time_historical_cutoff: Math.round(Date.now() / 1000),
        get_descriptions: 1
    }, function(error, body) {
        if (error) {
            return log(error);
        }

        if (
            body
            && body.response
            && body.response.trade_offers_received
        ) {
            var descriptions = {};


            body.response.trade_offers_received.forEach(function (offer) {
                if (offer.trade_offer_state !== 2) {
                    return;
                }

                console.log('#######################################');
                var offerMessage = 'Got an offer ' + offer.tradeofferid +
                    ' from ' + offer.steamid_other + '\n';

                if (offer.items_to_receive) {
                    offerMessage += 'Items to receive: ' +
                    offer.items_to_receive.map(function (item) {
                        return item.appid + ';' + item.classid + ';' + item.instanceid;
                    }).join(', ') + '\n';
                }

                if (offer.items_to_give) {
                    offerMessage += 'Items to give: ' +
                    offer.items_to_give.map(function (item) {
                        return item.appid + ';' + item.classid + ';' + item.instanceid;
                    }).join(', ') + '\n';
                }

                if (offer.message && offer.message !== '') {
                    offerMessage += 'Message: ' + offer.message;
                }

                log(offerMessage);
                //console.log(offer.items_to_receive);
                /*[ { appid: '730',
                    contextid: '2',
                    assetid: '3960173990',
                    classid: '926978479',
                    instanceid: '0',
                    amount: '1',
                    missing: false } ]*/




                //console.log(offer.items_to_give);

                /***
                 * [ { appid: '730',
                    contextid: '2',
                    assetid: '3959029679',
                    classid: '384801319',
                    instanceid: '0',
                    amount: '1',
                    missing: false },
                 { appid: '730',
                   contextid: '2',
                   assetid: '3959029631',
                   classid: '384801319',
                   instanceid: '0',
                   amount: '1',
                   missing: false },
                 ]

                 *
                 */

                if (!offer.items_to_give) {
                    offers.acceptOffer({
                        tradeOfferId: offer.tradeofferid
                    }, function (error, result) {
                        if (error) {
                            return log(error);
                        }

                        log('Offer ' + offer.tradeofferid + ' accepted');

                        offers.getOffer({
                            tradeofferid: offer.tradeofferid
                        }, function (error, result) {
                            if (error) {
                                return log(error);
                            }

                            if (result
                                && result.response
                                && result.response.offer
                                && result.response.offer.tradeid
                            ) {
                                offers.getItems({
                                    tradeId: result.response.offer.tradeid
                                }, function (error, result) {
                                    if (error) {
                                        return log(error);
                                    }

                                   // console.log(result);
                                   /* [ Object {
                                        id: '3960842424',
                                        owner: '76561198042384491',
                                        classid: '991959905',
                                        instanceid: '0',
                                        icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FF8ugPDMIWpAuIq1w4KIlaChZOyFwzgJuZNy3-2T89T0jlC2rhZla2vwIJjVLFHz75yKpg',
                                        icon_drag_url: '',
                                        name: 'Falchion Case',
                                        market_hash_name: 'Falchion Case',
                                        market_name: 'Falchion Case',
                                        name_color: 'D2D2D2',
                                        background_color: '',
                                        type: 'Base Grade Container',
                                        tradable: 1,
                                        marketable: 1,
                                        commodity: 1,
                                        market_tradable_restriction: '7',
                                        descriptions:
                                            Array [
                                                [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object] ],
                                        owner_descriptions: '',
                                        tags: Array [ [Object], [Object], [Object], [Object] ],
                                        pos: 1,
                                        appid: 730,
                                        contextid: 2,
                                        amount: 1,
                                        is_stackable: false },
                                        Object {
                                        id: '3960842480',
                                        owner: '76561198042384491',
                                        classid: '384801319',
                                        instanceid: '0',
                                        icon_url: '-9a81dlWLwJ2UUGcVs_nsVtzdOEdtWwKGZZLQHTxDZ7I56KU0Zwwo4NUX4oFJZEHLbXU5A1PIYQNqhpOSV-fRPasw8rsUFJ5KBFZv668FFUuh6qZJmlD7tiyl4OIlaGhYuLTzjhVupJ12urH89ii3lHlqEdoMDr2I5jVLFFSv_J2Rg',
                                        icon_drag_url: '',
                                        name: 'Operation Phoenix Weapon Case',
                                        market_hash_name: 'Operation Phoenix Weapon Case',
                                        market_name: 'Operation Phoenix Weapon Case',
                                        name_color: 'D2D2D2',
                                        background_color: '',
                                        type: 'Base Grade Container',
                                        tradable: 1,
                                        marketable: 1,
                                        commodity: 1,
                                        market_tradable_restriction: '7',
                                        descriptions:
                                            Array [
                                                [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object],
                                                    [Object] ],
                                        owner_descriptions: '',
                                        tags: Array [ [Object], [Object], [Object], [Object] ],
                                        pos: 2,
                                        appid: 730,
                                        contextid: 2,
                                        amount: 1,
                                        is_stackable: false } ]*/


                                    var items = 'Got items:\n' +
                                        result.map(function (item) {
                                            return 'http://steamcommunity.com/profiles/' +
                                                item.owner + '/inventory/#' +
                                                item.appid + '_' + item.contextid + '_' + item.id;
                                        }).join('\n');

                                    log(items);
                                });
                            }
                        });
                    });
                } else {

                   // log('Offer ' + offer.tradeofferid + ' skipped!');



                    if (give || (bots[offer.steamid_other] && bots[offer.steamid_other] == 1)) {
                        offers.acceptOffer({
                            tradeOfferId: offer.tradeofferid
                        }, function (error, result) {
                            if (error) {
                                return log(error);
                            }

                            log('Offer ' + offer.tradeofferid + ' accepted');
                        });
                    }

                    bots[offer.steamid_other] = 1;

                    /*offers.declineOffer({
                        tradeOfferId: offer.tradeofferid
                    }, function (error, result) {
                        if (error) {
                            return log(error);
                        }

                        log('Offer ' + offer.tradeofferid + ' declined');
                    });*/
                }
            });
        }
    });
}


function acceptItemTrade(){
    offers.acceptOffer({
        tradeOfferId: offer.tradeofferid
    }, function (error, result) {
        if (error) {
            return log(error);
        }

        log('Offer ' + offer.tradeofferid + ' accepted');

        offers.getOffer({
            tradeofferid: offer.tradeofferid
        }, function (error, result) {
            if (error) {
                return log(error);
            }

            if (result
                && result.response
                && result.response.offer
                && result.response.offer.tradeid
            ) {
                offers.getItems({
                    tradeId: result.response.offer.tradeid
                }, function (error, result) {
                    if (error) {
                        return log(error);
                    }

                    var items = 'Got items:\n' +
                        result.map(function (item) {
                            return 'http://steamcommunity.com/profiles/' +
                                item.owner + '/inventory/#' +
                                item.appid + '_' + item.contextid + '_' + item.id;
                        }).join('\n');

                    log(items);
                });
            }
        });
    });

}

function log (message) {
    console.log(new Date().toString() + ' - ' + message);
    steamFriends.sendMessage(admin, message.toString());
}

function getSHA1 (bytes) {
    var shasum = crypto.createHash('sha1');
    shasum.end(bytes);
    return shasum.read();
}
