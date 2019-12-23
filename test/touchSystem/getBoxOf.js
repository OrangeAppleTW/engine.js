var s1 = Game.createSprite('assets/bird.png');
var s2 = Game.createSprite('assets/background.jpg');
var s3 = Game.createSprite('assets/gameover.png');

Game.forever(function() {
    [s1, s2, s3].forEach((s, idx) => {
        var box = s._touchSystem.getBoxOf(s);
        s.x = 300 + idx*300;
        s.direction++;
        s.opacity = 0.5;
        s.scale = 0.5 + Math.abs(s.direction - 180)/360;
        Game.pen.color = 'red';
        Game.pen.drawRect(box.x - box.width/2, box.y - box.height/2, box.width, box.height);
    });
});