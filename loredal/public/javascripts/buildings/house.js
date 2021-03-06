var houseState = 0, houseCounter,
    houseTick,
    progressHouseUpdate,
    progressHouse, houseTurn, houseTime;

var houseUpdate = function(house){

    document.querySelector('.house-progress').MaterialProgress.setProgress(0);
    $('.mdl-card__title-count').text(house.count);
    $('.house-description').html(
        'Домов 1<br>Населения: '+house.currentCapacity+'/'+(house.maxCapacity*house.count)+'<br>Рост: 1'
    );
};


var houseDone = function(house){

    clearInterval(houseTurn);
    houseUpdate(house);

    houseState = 0;
    progressHouse = 0;
    houseCounter = 0;
};

var houseStarted = function(house){

    houseUpdate(house);

    if (houseState == 1){
        return true;
    }

    houseState = 1;

    var houseProgress = document.querySelector('.house-progress').MaterialProgress;

    houseProgress.setProgress(0);

    houseTick = 100;

    houseTime = house.prodInterval - house.currentProduction - houseTick;


    houseCounter = 0;

    progressHouseUpdate = houseTick/houseTime*100;

    progressHouse = house.currentProduction/ house.prodInterval*100;


    houseTurn = setInterval(function(){
        if(houseCounter <= houseTime) {
            houseCounter += houseTick;
            progressHouse += progressHouseUpdate;
            houseProgress.setProgress(progressHouse);
        } else {
            clearInterval(houseTurn);
            houseState = 0;
            houseProgress.setProgress(0);
            progressHouse = 0;
            houseCounter = 0;
        }
    }, houseTick);

};