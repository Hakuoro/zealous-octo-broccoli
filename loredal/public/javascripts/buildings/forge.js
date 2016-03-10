var forgeState = 0, forgeCounter,
    forgeTick,
    progressForgeUpdate,
    progressForge, forgeTurn, forgeTime;


var forgeUpdate = function(forge){

    $('.mdl-card__title-count').text(forge.count);
    $('.forge-description').html(
        'Кузнецов: '+forge.workersCount+ '/'+(forge.maxWorkersCount*forge.count)+'<br>Добыча: ' + (forge.workersCount * forge.production)
    );
};

var forgeDone = function(forge){

    clearInterval(forgeTurn);
    document.querySelector('.forge-progress').MaterialProgress.setProgress(0);

    forgeUpdate(forge);

    forgeState = 0;
    progressForge = 0;
    forgeCounter = 0;
};

var forgeStarted = function(forge){

    if (forgeState == 1) {
        return true;
    }


    forgeUpdate(forge);


    forgeState = 1;

    var forgeProgress = document.querySelector('.forge-progress').MaterialProgress;

    forgeProgress.setProgress(0);

    forgeTick = 100;

    forgeTime = forge.prodInterval - forge.currentProduction - forgeTick;

    forgeCounter = 0;

    progressForgeUpdate = forgeTick/forgeTime*100;

    progressForge = forge.currentProduction/ forge.prodInterval*100;


    forgeTurn = setInterval(function(){
        if(forgeCounter <= forgeTime) {
            forgeCounter += forgeTick;
            progressForge += progressForgeUpdate;
            forgeProgress.setProgress(progressForge);
        } else {
            clearInterval(forgeTurn);
            forgeState = 0;
            forgeProgress.setProgress(0);
            progressForge = 0;
            forgeCounter = 0;
        }
    }, forgeTick);

};