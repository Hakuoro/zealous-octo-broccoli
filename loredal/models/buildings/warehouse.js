/**
 *  abstract infinite warehouse
 * @param opts
 * @constructor
 */
function Warehouse(opts) {
    this.store = opts || {};
}



Warehouse.prototype.get = function(name, count) {

    if (typeof(this.store['name'] == 'undefined'))
        return 0;

    if (this.store['name'] < count){

        count = this.store['name'];
        this.store['name'] = 0;
        return count;

    }


    this.store['name'] -= count;

    return count;
};

Warehouse.prototype.put = function(name, count) {

    this.store['name'] += count;
};

Warehouse.prototype.put = function(name) {
    this.put(name, 1);
};

Warehouse.prototype.get = function(name) {
    this.get(name, 1);
};

Warehouse.prototype.toJSON = function(name) {
    return this.store;
};


exports = module.exports = Warehouse;