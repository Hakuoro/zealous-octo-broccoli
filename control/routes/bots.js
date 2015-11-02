var express = require('express');
var router = express.Router();

var bot = require('../models/bot');

// bots list
router.get('/', function(req, res, next) {

    res.render('bot/list', bot.list());

});

router.get('/show/:id', function(req, res, next) {

    res.render('bot/index', bot.show(req.params.id));

});

router.get('/set/:id/trade/:trade', function(req, res, next) {


    bot.set_trade(req.params.id, req.params.trade, function (err, give) {
        res.render('bot/index', {'give':give});
    });


});


module.exports = router;
