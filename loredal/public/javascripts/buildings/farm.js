var farmState = 0, farmCounter,
    farmTick,
    progressfarmUpdate,
    progressfarm, farmTurn, farmTime;


var farmUpdate = function(farm){

    $('.mdl-card__title-count').text(farm.count);
    $('.farm-description').html(
        'Фермеров: '+farm.workersCount+ '/'+(farm.maxWorkersCount*farm.count)+'<br>Еды: '+farm.currentCapacity+'/'+(farm.maxCapacity*farm.count)+'<br>Рост: ' + (farm.workersCount * farm.production)
    );
};

var farmDone = function(farm){

    clearInterval(farmTurn);
    document.querySelector('.farm-progress').MaterialProgress.setProgress(0);

    farmUpdate(farm);

    farmState = 0;
    progressfarm = 0;
    farmCounter = 0;
};

var farmStarted = function(farm){

    if (farmState == 1) {
        return true;
    }


    farmUpdate(farm);


    farmState = 1;

    var farmProgress = document.querySelector('.farm-progress').MaterialProgress;

    farmProgress.setProgress(0);

    farmTick = 100;

    farmTime = farm.prodInterval - farm.currentProduction - farmTick;

    farmCounter = 0;

    progressfarmUpdate = farmTick/farmTime*100;

    progressfarm = farm.currentProduction/ farm.prodInterval*100;


    farmTurn = setInterval(function(){
        if(farmCounter <= farmTime) {
            farmCounter += farmTick;
            progressfarm += progressfarmUpdate;
            farmProgress.setProgress(progressfarm);
        } else {
            clearInterval(farmTurn);
            farmState = 0;
            farmProgress.setProgress(0);
            progressfarm = 0;
            farmCounter = 0;
        }
    }, farmTick);

};