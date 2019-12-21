const { cursor, pen } = Game;
var s = Game.createSprite('assets/gameover.png');

Game.forever(function() {
    s.direction += 0.2;

    var box1 = s._touchSystem.getBoxOf(s);
    var box2 = s._touchSystem.getBoxOf({ x: cursor.x, y: cursor.y, width: 2, height: 2, direction: 0, area: 4 });
    
    Game.pen.drawRect(box1.x - box1.width/2, box1.y - box1.height/2, box1.width, box1.height);

    pen.color = s._touchSystem.AABBJudger(box1, box2) ? 'red' : 'blue';
    s.opacity = s._touchSystem.isTouchDot(s, cursor.x, cursor.y) ? 1 : 0.5;
    
});