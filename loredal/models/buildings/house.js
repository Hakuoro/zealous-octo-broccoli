const util = require('util');
const Building = require('./base');

function House(opts) {
    Building.call(this, opts);
}

util.inherits(House, Building);



exports = module.exports = House;