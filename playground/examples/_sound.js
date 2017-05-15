Game.preload([
    "./assets/hallelujah.mp3",
    "./assets/laser1.wav",
    "./assets/bomb.mp3",
    "./assets/johnCena.mp3",
    "./assets/BonusCube.mp3"
],function() {
    console.log('done!');
    init();
}, function(i) {
    console.log('completed: ' + i);
});

function init () {
    var btn_1 = Game.createSprite({
        x:108, y:148,
        costumes:"./images/tower-btn.png"
    });
    var btn_2 = Game.createSprite({
        x:208, y:198,
        costumes:"./images/tower-btn.png"
    });
    var btn_3 = Game.createSprite({
        x:308, y:248,
        costumes:"./images/tower-btn.png"
    });
    var btn_4 = Game.createSprite({
        x:408, y:298,
        costumes:"./images/tower-btn.png"
    });
    var btn_5 = Game.createSprite({
        x:508, y:348,
        costumes:"./images/tower-btn.png"
    });
    var btn_6 = Game.createSprite({
        x:508, y:148,
        costumes:"./images/tower-btn.png"
    });

    btn_1.sound = "./assets/hallelujah.mp3";
    btn_2.sound = "./assets/laser1.wav";
    btn_3.sound = "./assets/bomb.mp3";
    btn_4.sound = "./assets/johnCena.mp3";
    btn_5.sound = "./assets/BonusCube.mp3";

    btn_1.when('click', playSound);
    btn_2.when('click', playSound);
    btn_3.when('click', playSound);
    btn_4.when('click', playSound);
    btn_5.when('click', playSound);
    btn_6.when('click', function() {Game.sound.stop()});

    function playSound () {
        Game.sound.play(this.sound);
    }
}

Game.start();