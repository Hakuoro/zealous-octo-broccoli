var request     = require('request');


//var url = "https://opskins.com/api/user_api.php?request=GetActiveSales&key=debb4a790d09035e400320034f282274";
var url = "https://opskins.com/api/user_api.php?request=test&key=debb4a790d09035e400320034f282274";

request(url, function (error, response, body) {
    console.log(body);
    try {
        var json = JSON.parse(body);
    } catch (e) {
        console.log('This doesn\'t look like a valid JSON: '+body);
    }

    console.log(json);


});