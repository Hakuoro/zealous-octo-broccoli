// ==UserScript==
// @name        pricer
// @namespace   opskin_seller
// @include     https://opskins.com/index.php?loc=store_account
// @version     1
// @grant       none
// ==/UserScript==

/*function iTrans() {
 $.ajax({
 type: 'POST',
 url: 'ajax/shop_account.php',
 data: {type: 'itrans', csrf: g_CSRF},
 success: function (result) {
 $('#iTrans').html(result).show();
 }});
 }*/

$( "#accordion" ).before(
    '<input type="text" id="iName" name="iName" value="Shadow Case" style="color:#333">'+
    '<input type="text" id="iVal" name="iVal" value="55" style="color:#333">'+
    '<input type="button" id="iAdd1" value="Change val" style="color:#333"> <br/>'
);

var maxTry = 999;
var currentTry = 0;

$('#iAdd1').click(function () {


    $.each($('tr.active'), function( k, v ) {
            var name = $(v).find('td a').html();


            if (name == $('#iName').val()){
                var price = $(v).find('td:eq(1)').html().toString();
                price = price.substring(0, price.indexOf(' '));


                if (price != $('#iVal').val() && currentTry < maxTry){

                    var link = $(v).find('td:eq(0) a').attr( "href" );

                    var itemId =  link.substring(link.lastIndexOf('item=')+5);

                    $.ajax({
                        type: 'POST',
                        url: 'ajax/shop_account.php',
                        async: false,
                        data: {
                            type: 'editItem',
                            amount: $('#iVal').val(),
                            id: itemId,
                            csrf: g_CSRF
                        },
                        success: function (result) {
                            console.log(currentTry + ' '  + price +' '+$('#iVal').val() + ' '+ name + ' ' + result);

                        }
                    });
                    currentTry++;
                }

            }

        }

    );

    alert('Done!');
})