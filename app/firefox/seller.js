// ==UserScript==
// @name        sell_v2
// @namespace   opskin_seller
// @include     https://opskins.com/index.php?loc=shop_sale_form
// @version     1
// @grant       none
// ==/UserScript==


$( "#shopSellItemForm" ).before(
    'Operation Phoenix Weapon Case '+
    '<input type="text" id="iVal1" name="iVal" value="5" style="color:#333">'+
    '<input type="button" id="iAdd1" value="add" style="color:#333"> <br/>' +
    'Shadow Case'+
    '<input type="text" id="iVal2" name="iVal" value="55" style="color:#333">'+
    '<input type="button" id="iAdd2" value="add" style="color:#333"> <br/>' +
    'Chroma 2 Case'+
    '<input type="text" id="iVal3" name="iVal" value="7" style="color:#333">'+
    '<input type="button" id="iAdd3" value="add" style="color:#333"> <br/>' +
    'Falchion Case'+
    '<input type="text" id="iVal4" name="iVal" value="5" style="color:#333">'+
    '<input type="button" id="iAdd4" value="add" style="color:#333"> <br/>'
);


var maxCount = 10;
var addedItems = {};


var currentPrice = 0;
var currentName = '';


$('#iAdd1').click(function () {
    currentName = 'Operation Phoenix Weapon Case';
    currentPrice = $('#iVal1').val()
    AddItemToQueue();
})

$('#iAdd2').click(function () {
    currentName = 'Shadow Case';
    currentPrice = $('#iVal2').val()
    AddItemToQueue();
})

$('#iAdd3').click(function () {
    currentName = 'Chroma 2 Case';
    currentPrice = $('#iVal3').val()
    AddItemToQueue();
})

$('#iAdd4').click(function () {
    currentName = 'Falchion Case';
    currentPrice = $('#iVal4').val()
    AddItemToQueue();
})



function findItem(name){

    var itemCount = 0;
    var ii=1;
    var items = {};

    while (itemCount < maxCount) {


        var item = '#userItem' + ii;

        if ($(item).length == 0){
            return items;
        }

        if (ii in addedItems){
            ii++;
            continue;
        }

        if ( $(item).data('marketname') == name){
            var assetId = $(item).data('asset');
            items[ii] = item;
            addedItems[ii] = item;
            itemCount++;
        }

        ii++;
    }

    return items;
}

function AddItemToQueue () {

    var items = findItem(currentName);

    $.each(items, function( id, item ) {


        var sellPrice = currentPrice;

        var img = $(item).data('img');

        var color = $(item).data('color');

        var marketName = $(item).data('marketname');

        var assetId = $(item).data('asset');

        var queue = $('#qItems');

        var status = "";

        var nItem = "<div class='col-md-2 pg-item page' id='qItem" + id + "'>" +
            "<div class='sale-item' style='background-color:#142438;border: 1px solid #003345;color:white;width:120px;height:160px;'>" +
            "<div class='sale-item-desc' style='font-size:16px;'>" + status + sellPrice + "<span class='icon-logo'></span></div>" +
            "<img class='img-rounded sale-item-img' src='https://steamcommunity-a.akamaihd.net/economy/image/" + img + "/62fx62f' />" +
            "<br />" +
            "<div class='sale-item-desc' ' style='font-size:12px;color:#" + color + "'>" + marketName + "</div>" +
            "<span class='remove-item' style='cursor:pointer;font-size:16px;color:white;position:absolute;bottom:5px;left:33px; alt='Remove item from Queue' id='rQueue' onclick=\"dqItem('" + id + "');\">Remove</span>" +
            "</div></div>";

        queue.append(nItem);

        $(item).hide();

        $('#tos').prop( "checked", true );

        itmObj[assetId] = [sellPrice, false, false];

    });



};