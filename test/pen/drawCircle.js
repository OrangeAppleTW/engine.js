Game.setBackdrop('white');

var pen = Game.pen;

Game.forever(function() {
    
    pen.color = 'green';
    pen.size = 8;
    pen.drawCircle(200, 100, 100);

});

Game.start();