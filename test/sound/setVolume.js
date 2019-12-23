var bgm = Game.sound.play("./assets/bgm.ogg", true);
var bar = Game.createSprite("./assets/stop.png");

Game.forever(function() {
    var volume, percent;
    bar.x = Game.cursor.x;
    bar.y = 450;

    Game.pen.fillColor = "black";
    Game.pen.drawLine(0, 450, 1200, 450);
    
    volume = bar.x / 1200;
    percent = (Math.round(volume * 1000)/10);
    Game.print("Volume: "+ percent +"%", 10, 10, 'black', 60);
    Game.sound.setVolume(volume);
});