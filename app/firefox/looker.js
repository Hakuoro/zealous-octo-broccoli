// ==UserScript==
// @name        looker
// @namespace   opskin_seller
// @include     https://opskins.com/?loc=shop_search*
// @version     1
// @grant       none
// ==/UserScript==


$('#scroll').before(
    '<input type="text" id="opskinCut" name="iName" value="5" style="color:#333">'+
    '<input type="text" id="paypalCut" name="iVal" value="2.9" style="color:#333">'+
    '<input type="text" id="rate" name="iVal" value="60" style="color:#333">'+
    '<input type="button" id="iAdd1" value="Calculate" style="color:#333"> <br/>'
);

$('#iAdd1').click(function () {

    var price = 0;
    var cut = (100 - $('#opskinCut').val())/100 * (100 - $('#paypalCut').val())/100;

    $(".item-amount-new12").remove();

    $.each($('.item-amount'), function( k, v ) {
        price = $(v).html().replace('<span class="icon-logo"></span>', '').replace(',','');
        $(v).after('<div class="item-amount item-amount-new12"> '+ (price * cut * $('#rate').val() / 100 ).toFixed(2) + '</div>'  );

    });


});