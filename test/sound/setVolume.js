var bgm = Game.sound.play("./assets/bgm.ogg", true);
var bar = Game.createSprite("./assets/stop.png");

Game.forever(function() {
    var volume, percent;
    bar.x = Game.cursor.x;
    bar.y = 200;

    Game.pen.fillColor = "black";
    Game.pen.drawLine(0, 200, 520, 200);
    
    volume = bar.x / 520;
    percent = (Math.round(volume * 1000)/10);
    Game.print("Volume: "+ percent +"%");
    Game.sound.setVolume(volume);
});