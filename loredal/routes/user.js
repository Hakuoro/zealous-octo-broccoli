
/*
 * GET users listing.
 */

exports.list = function(req, res){

  console.log(req.app.locals.connections);

  res.send("11");
};