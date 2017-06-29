var bgm = Game.sound.play("./assets/bgm.ogg");
var bar = Game.createSprite("./assets/stop.png");
bgm.loop = true;

Game.forever(function() {
    bar.x = cursor.x;
    bar.y = 200;
    Game.pen.fillColor = "black";
    Game.pen.drawLine(0, 200, 520, 200);
});