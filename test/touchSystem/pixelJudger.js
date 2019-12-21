const { cursor, pen } = Game;
var s1 = Game.createSprite('assets/gameover.png');
var s2 = Game.createSprite('assets/gameover.png');

Game.forever(function() {
    s2.moveTo(Game.cursor);
    s1.direction += 0.2;
    s2.direction -= 0.1;
    s1.scale = 0.5 + s1.direction/360;
    s2.scale = 0.5 + s1.direction/360;
    
    var s1_box = s1._touchSystem.getBoxOf(s1);
    var s2_box = s2._touchSystem.getBoxOf(s2);
    pen.drawRect(s1_box.x - s1_box.width/2, s1_box.y - s1_box.height/2, s1_box.width, s1_box.height);
    pen.drawRect(s2_box.x - s2_box.width/2, s2_box.y - s2_box.height/2, s2_box.width, s2_box.height);
    
    pen.color = s1._touchSystem.AABBJudger(s1_box, s2_box) ? 'red' : 'blue';
    s1.opacity = s2.opacity = s1._touchSystem.isTouch(s1, s2) ? 1 : 0.5;
});