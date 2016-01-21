/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('index', {
        title: 'Express1111',
        token: '123asd'
    });
};