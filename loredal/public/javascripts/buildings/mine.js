var mineState = 0, mineCounter,
    mineTick,
    progressMineUpdate,
    progressMine, mineTurn, mineTime;


var mineUpdate = function(mine){

    $('.mdl-card__title-count').text(mine.count);
    $('.mine-description').html(
        'Шахтеров: '+mine.workersCount+ '/'+(mine.maxWorkersCount*mine.count)+'<br>Руды: '+mine.currentCapacity+'/'+(mine.maxCapacity*mine.count)+'<br>Добыча: ' + (mine.workersCount * mine.production)
    );
};

var mineDone = function(mine){

    clearInterval(mineTurn);
    document.querySelector('.mine-progress').MaterialProgress.setProgress(0);

    mineUpdate(mine);

    mineState = 0;
    progressMine = 0;
    mineCounter = 0;
};

var mineStarted = function(mine){

    if (mineState == 1) {
        return true;
    }


    mineUpdate(mine);


    mineState = 1;

    var mineProgress = document.querySelector('.mine-progress').MaterialProgress;

    mineProgress.setProgress(0);

    mineTick = 100;

    mineTime = mine.prodInterval - mine.currentProduction - mineTick;

    mineCounter = 0;

    progressMineUpdate = mineTick/mineTime*100;

    progressMine = mine.currentProduction/ mine.prodInterval*100;


    mineTurn = setInterval(function(){
        if(mineCounter <= mineTime) {
            mineCounter += mineTick;
            progressMine += progressMineUpdate;
            mineProgress.setProgress(progressMine);
        } else {
            clearInterval(mineTurn);
            mineState = 0;
            mineProgress.setProgress(0);
            progressMine = 0;
            mineCounter = 0;
        }
    }, mineTick);

};