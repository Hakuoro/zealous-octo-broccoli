var farmState = 0, farmCounter,
    farmTick,
    progressfarmUpdate,
    progressfarm, farmTurn, farmTime;

var farmDone = function(farm){

    clearInterval(farmTurn);
    document.querySelector('.farm-progress').MaterialProgress.setProgress(0);
    $('.mdl-card__title-count').text(farm.count);
    $('.farm-description').html(
        'Фермеров: 1<br>Еды: '+farm.currentCapacity+'/'+(farm.maxCapacity*farm.count)+'<br>Рост: 1'
    );

    farmState = 0;
    progressfarm = 0;
    farmCounter = 0;
};

var farmStart = function(farm){


    farmState = 1;

    var farmProgress = document.querySelector('.farm-progress').MaterialProgress;

    farmProgress.setProgress(0);

    farmTick = 1000;

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