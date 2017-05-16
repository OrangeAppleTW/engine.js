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
        x:108, y:168,
        costumes:"./images/tower-btn.png"
    });
    var btn_2 = Game.createSprite({
        x:208, y:218,
        costumes:"./images/tower-btn.png"
    });
    var btn_3 = Game.createSprite({
        x:308, y:268,
        costumes:"./images/tower-btn.png"
    });
    var btn_4 = Game.createSprite({
        x:408, y:318,
        costumes:"./images/tower-btn.png"
    });
    var btn_5 = Game.createSprite({
        x:508, y:368,
        costumes:"./images/tower-btn.png"
    });
    var btn_6 = Game.createSprite({
        x:100, y:100,
        costumes:"./images/tower-btn.png"
    });
    var btn_7 = Game.createSprite({
        x:200, y:100,
        costumes:"./images/tower-btn.png"
    });
    var btn_8 = Game.createSprite({
        x:300, y:100,
        costumes:"./images/tower-btn.png"
    });
    var btn_9 = Game.createSprite({
        x:400, y:100,
        costumes:"./images/tower-btn.png"
    });

    var volume = 100;
    var muted = false;

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
    btn_6.when('click', function() { Game.sound.stop() });
    btn_7.when('click', function() { volume += 5; if(volume>=100) volume=100; Game.sound.setVolume(volume/100); });
    btn_8.when('click', function() { volume -= 5; if(volume<=0)   volume=0;   Game.sound.setVolume(volume/100); });
    btn_9.when('click', function() { muted = !muted; Game.sound.mute(muted);});

    function playSound () {
        Game.sound.play(this.sound);
    }

    Game.forever(function() {
        Game.print('volume: ' + volume/100, 10, 10, 'red', 20);
        Game.print('muted: ' + muted, 10, 30, 'red', 20);
    });
}

Game.start();