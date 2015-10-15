var request     = require('request');


//var url = "https://opskins.com/api/user_api.php?request=GetActiveSales&key=d";
var url = "https://opskins.com/api/user_api.php?request=test&key=";

request(url, function (error, response, body) {
    console.log(body);
    try {
        var json = JSON.parse(body);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: '+body);
    }

    console.log(json);


});