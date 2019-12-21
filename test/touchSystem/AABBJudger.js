const { pen, cursor } = Game;
var s1 = Game.createSprite('assets/gameover.png');
var s2 = Game.createSprite('assets/gameover.png');

s1.opacity = s2.opacity = 0.5;

Game.forever(function() {
    s2.moveTo(cursor);
    s1.direction += 0.2;
    s2.direction -= 0.05;

    var s1_box = s1._touchSystem.getBoxOf(s1);
    var s2_box = s2._touchSystem.getBoxOf(s2);
    pen.drawRect(s1_box.x - s1_box.width/2, s1_box.y - s1_box.height/2, s1_box.width, s1_box.height);
    pen.drawRect(s2_box.x - s2_box.width/2, s2_box.y - s2_box.height/2, s2_box.width, s2_box.height);

    pen.color = s1._touchSystem.AABBJudger(s1_box, s2_box) ? 'red' : 'blue';
});