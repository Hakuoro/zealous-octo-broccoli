/**
 *  abstract infinite warehouse
 * @param opts
 * @constructor
 */
function Warehouse(opts) {
    this.storage = opts || {};
}



Warehouse.prototype.get = function(name, count) {

    if (typeof(this.storage['name'] == 'undefined'))
        return 0;

    if (this.storage['name'] < count){

        count = this.storage['name'];
        this.storage['name'] = 0;
        return count;

    }


    this.storage['name'] -= count;

    return count;
};

Warehouse.prototype.put = function(name, count) {

    this.storage['name'] += count;
};

Warehouse.prototype.put = function(name) {
    this.put(name, 1);
};

Warehouse.prototype.get = function(name) {
    this.get(name, 1);
};


exports = module.exports = Warehouse;