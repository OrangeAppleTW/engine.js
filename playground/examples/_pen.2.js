Game.setBackdrop('#333');

var shapes = [];
for(var i=0; i<3000; i++) {
    shapes.push({
        x: Math.random()*640,
        y: Math.random()*480,
        r: Math.random()*10
    });
}

Game.forever(function() {
    for(var i=0; i<shapes.length; i++) {
        var s = shapes[i];
        s.y += 1;
        if(s.y > 480) {
            s.x = Math.random()*640;
            s.y = 0;
        }
        Game.pen.color = randomColor();
        if(i < 1000) Game.pen.drawCircle(s.x, s.y, s.r);
        else if(i < 2000) Game.pen.drawRect(s.x, s.y, s.r, s.r);
        else Game.pen.drawLine(s.x, s.y, s.r, s.r);
    }
    Game.print(Game.inspector.fps,10,10,'red',30);
});

function randomColor () {
    var s = '0123456789abcdef';
    var r = '#';
    for(var i=0;i<6;i++) {
        r += s[Math.ceil(Math.random()*16)];
    }
    return r;
}

Game.start();