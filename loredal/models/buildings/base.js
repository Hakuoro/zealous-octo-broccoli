function Base(opts){

    this.currentCapacity = opts.currentCapacity || 1;
    this.maxCapacity = opts.maxCapacity || 10;
    this.name = opts.name || "";
    this.exp = opts.level || 1;
}

module.exports = Base;