/* START EDITING */

// Put your 64-bit SteamID here so the bot can accept your offers
var configPath = process.argv[2] || process.env.APP_CONFIG_PATH || './bot.conf.json';

var logOnOptions = require(configPath);

var admin = "76561198042384491";

var authCode = '2P9QG'; // Code received by email

/* STOP EDITING */

var fs = require('fs');
var crypto = require('crypto');

var onTrade = 0;
var TradeOpen = 0;

var Steam = require('steam');
var SteamWebLogOn = require('steam-weblogon');
var getSteamAPIKey = require('steam-web-api-key');
var SteamTradeOffers = require('steam-tradeoffers');

var sentryFileName = 'sentry77'; // steam guard data file name

try {
    logOnOptions.sha_sentryfile = getSHA1(fs.readFileSync(sentryFileName));
} catch (e) {
    if (authCode !== '') {
        logOnOptions.auth_code = authCode;
    }
}

// if we've saved a server list, use it
if (fs.existsSync('servers')) {
    Steam.servers = JSON.parse(fs.readFileSync('servers'));
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
                    console.log("load inventory")
                    offers.loadMyInventory({
                     appId: 730,
                     contextId:2
                     }, loadMyBags)
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



function loadMyBags($vara, $bags){

    console.log($bags);
}


function getSHA1 (bytes) {
    var shasum = crypto.createHash('sha1');
    shasum.end(bytes);
    return shasum.read();
}
