var request     = require('request');


//var url = "https://opskins.com/api/user_api.php?request=GetActiveSales&key=debb4a790d09035e400320034f282274";
var url = "https://opskins.com/api/user_api.php?request=test&key=debb4a790d09035e400320034f282274";


var headers = {
 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:41.0) Gecko/20100101 Firefox/41.0',
 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
'Accept-Language': 'ru-RU,ru;q=0.8,en-US;q=0.5,en;q=0.3',

'Cookie': '__cfduid=d60027d0c06fda1599717b1f8710719461442851748; _ga=GA1.2.1272150177.1442852579; __mmapiwsid=4BDC0C22-2192-11E5-8EA7-2340559CF7BD:2c4e8f0e8d7162f37616fd930bf785d0848e9c68; __utma=68077007.1272150177.1442852579.1445429967.1445434295.10; __utmz=68077007.1443084823.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); avatar=https%3A%2F%2Fsteamcdn-a.akamaihd.net%2Fsteamcommunity%2Fpublic%2Fimages%2Favatars%2Ffe%2Ffef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg; __utmc=68077007; opskins_csrf=vObQabjdrOEXVKWgMN7daQ4zjZC34uNp; cf_clearance=6e83c1a890ad6d5906881844a754574261b896e3-1445602427-900; PHPSESSID=ack3flpktokfgpj3ohbh56m995; _gat=1',
'Connection': 'keep-alive',
'Pragma': 'no-cache',
'Cache-Control': 'no-cache'
}

var options = {
    url: url,
    method: 'GET',
    headers: headers
}


request(options, function (error, response, body) {


    //body = body.toString('utf-8');

    console.log(body);
});