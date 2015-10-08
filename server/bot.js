/**
 * Created by boris on 08.10.15.
 */
var crypto = require('crypto');
var fs = require('fs');
var Steam = require('steam');

var configPath = process.argv[2] || process.env.APP_CONFIG_PATH || './bot.conf.json';

var logOnOptions = require(configPath);

var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
//var steamFriends = new Steam.SteamFriends(steamClient);

var authCode = 'J82XR'; // code received by email

try {
    logOnOptions.sha_sentryfile = getSHA1(fs.readFileSync('sentry.conf'));
} catch (e) {
    if (authCode !== '') {
        logOnOptions.auth_code = authCode;
    }
}

// if we've saved a server list, use it
if (fs.existsSync('servers.conf')) {
    Steam.servers = JSON.parse(fs.readFileSync('servers.conf'));
}

steamClient.connect();

steamClient.on('connected', function() {
    steamUser.logOn(logOnOptions);
});

steamClient.on('servers', function(servers) {
    console.log('Saving servers!');
    fs.writeFile('servers.conf', JSON.stringify(servers));
});


steamClient.on('logOnResponse', function(logonResp) {
    console.log(logonResp);
    if (logonResp.eresult == Steam.EResult.OK) {
        console.log('Logged in!');
        //steamFriends.setPersonaState(Steam.EPersonaState.Online); // to display your bot's status as "Online"
        //steamFriends.setPersonaName('Haruhi'); // to change its nickname
        //steamFriends.joinChat('103582791431621417'); // the group's SteamID as a string
    }
});

steamUser.on('updateMachineAuth', function(sentry, callback) {
    console.log('Saving sentry!');
    fs.writeFileSync('sentry.conf', sentry.bytes);
    callback({ sha_file: getSHA1(sentry.bytes) });
});


function getSHA1(bytes) {
    var shasum = crypto.createHash('sha1');
    shasum.end(bytes);
    return shasum.read();
}

/*
 steamClient.on('error', function(e) {
 //console.log()
 // Error code for invalid Steam Guard code
 if (e.eresult == 63) {
 // Prompt the user for Steam Gaurd code
 rl.question('Steam Guard Code: ', function(code) {
 // Try logging on again
 steamClient.logOn({
 accountName: username,
 password: password,
 authCode: code,
 sha_sentryfile: sentryfile
 });
 });
 } else { // For simplicity, we'll just log anything else.
 // A list of ENUMs can be found here:
 // https://github.com/SteamRE/SteamKit/blob/d0114b0cc8779dff915c4d62e0952cbe32202289/Resources/SteamLanguage/eresult.steamd
 console.log('Steam Error: ' + e.eresult);
 // Note: Sometimes Steam returns InvalidPassword (5) for valid passwords.
 // Simply trying again solves the problem a lot of the time.
 }
 });


 steamClient.on('servers', function(servers) {
 fs.writeFile('servers', JSON.stringify(servers));
 });

 steamFriends.on('chatInvite', function(chatRoomID, chatRoomName, patronID) {
 console.log('Got an invite to ' + chatRoomName + ' from ' + steamFriends.personaStates[patronID].player_name);
 steamFriends.joinChat(chatRoomID); // autojoin on invite
 });

 steamFriends.on('message', function(source, message, type, chatter) {
 // respond to both chat room and private messages
 console.log('Received message: ' + message);
 if (message == 'ping') {
 steamFriends.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg); // ChatMsg by default
 }
 });

 steamFriends.on('chatStateChange', function(stateChange, chatterActedOn, steamIdChat, chatterActedBy) {
 if (stateChange == Steam.EChatMemberStateChange.Kicked && chatterActedOn == steamClient.steamID) {
 steamFriends.joinChat(steamIdChat);  // autorejoin!
 }
 });

 steamFriends.on('clanState', function(clanState) {
 if (clanState.announcements.length) {
 console.log('Group with SteamID ' + clanState.steamid_clan + ' has posted ' + clanState.announcements[0].headline);
 }
 });
 */
