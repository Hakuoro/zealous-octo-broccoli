function Base(opts){


    /**
     * building name
     * @type {*|string}
     */
    this.name = opts.name || "";

    /**
     *  building current capacity
     * @type {number}
     */
    this.currentCapacity = opts.currentCapacity || 0;

    /**
     * building max capacity
     * @type {number}
     */
    this.maxCapacity = opts.maxCapacity || 10;

    /**
     * level
     * @type {number}
     */
    this.level = opts.level || 1;

    /**
     * experience for next lvl
     * @type {number}
     */
    this.needExp = opts.needExp || 10;

    /**
     * exp per production interval
     * @type {number}
     */
    this.productionExp = opts.productionExp || 10;

    /**
     * production interval in millisecond
     * @type {number}
     */
    this.prodInterval = opts.prodInterval || 60000;

    /**
     * current production cycle complection
     * @type {number}
     */
    this.currentProduction = opts.currentProduction || 0;

    /**
     * production per production interval
     * @type {*|number}
     */
    this.production = opts.production || 1;


    /**
     *  experience multiply for level
     * @type {number}
     */
    this.expMult = opts.expMult || .12;

    /**
     *  building`s state
     * @type {number}
     */
    this.state = opts.state || 0;

    /**
     *  building`s count
     * @type {number}
     */
    this.count = opts.count || 1;




    this.workCirckeRef = null;

}

module.exports = Base;

Base.prototype.tick = function (){


};

Base.prototype.toJSON = function (){

    return {
        name:this.name,
        currentCapacity:this.currentCapacity,
        maxCapacity:this.maxCapacity,
        level:this.level,
        needExp:this.needExp,
        productionExp:this.productionExp,
        prodInterval:this.prodInterval,
        currentProduction:this.currentProduction,
        production:this.production,
        expMult:this.expMult,
        count:this.count,
        state:this.state
    };

};

/**
 *  leveling up
 */
Base.prototype.levelUp = function (){

    this.exp = 0;
    this.needExp        +=  Math.ceil(this.needExp * this.expMult);
    this.maxCapacity    +=  Math.ceil(this.maxCapacity * this.expMult);
    this.production     +=  Math.ceil(this.production * this.expMult);
    this.level ++;
};

/**
 * adding experience
 * @param exp
 */
Base.prototype.addExp = function (exp){

    this.exp += exp;

    if (this.exp > this.needExp){
        this.levelUp();
    }

};

/**
 *  done production process
 * @returns {boolean}
 */
Base.prototype.done = function (){

    this.state = 0;
    this.currentProduction = 0;

    this.currentCapacity += this.getProduction();

    if (this.currentCapacity > this.getCapacity()) {
        this.currentCapacity = this.getCapacity();
        return true;
    }

    this.addExp(this.productionExp);
};


Base.prototype.getProduction = function (){

    return this.production * this.count;
};


Base.prototype.getCapacity = function (){

    return this.maxCapacity * this.count;
};

/**
 * production process
 * @returns {boolean}
 */
Base.prototype.process = function (){

    var self = this;

    this.workCirckeRef = setInterval(function(){

        self.currentProduction += 1000;

        if (self.currentProduction >= self.prodInterval){
            clearInterval(self.workCirckeRef);
            self.done();
        }

    },1000)


};

/**
 * start production
 * @returns {boolean}
 */
Base.prototype.start = function (){

    if (this.state == 1 || this.currentCapacity >= this.getCapacity())
        return true;

    this.state = 1;

    this.process();
};

/**
 *  stop production
 */
Base.prototype.stop = function (){

    this.state = 0;
    this.currentProduction = 0;
    clearInterval(this.workCirckeRef);

};