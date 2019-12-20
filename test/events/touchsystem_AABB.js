var s1 = Game.createSprite('assets/gameover.png');
var s2 = Game.createSprite('assets/gameover.png');

s1.opacity = s2.opacity = 0.5;


Game.forever(function() {

    s2.moveTo(Game.cursor);

    s1.direction += 0.2;
    s2.direction -= 0.05;

    var s1_box = s1._touchSystem.getBoxOf(s1);
    var s2_box = s2._touchSystem.getBoxOf(s2);
    
    Game.pen.drawRect(s1_box.x - s1_box.width/2, s1_box.y - s1_box.height/2, s1_box.width, s1_box.height);
    Game.pen.drawRect(s2_box.x - s2_box.width/2, s2_box.y - s2_box.height/2, s2_box.width, s2_box.height);
    Game.pen.drawCircle(s1_box.x, s1_box.y, 10);
    Game.pen.drawCircle(s2_box.x, s2_box.y, 10);


    if (s1._touchSystem.AABB(s1_box, s2_box)) {
        Game.pen.color = 'red';
    } else {
        Game.pen.color = 'blue';
    }

    
    
});