Game.setBackdrop('white');

var pen = Game.pen;

Game.forever(function() {
    
    pen.color = 'red';
    pen.size = 10;
    pen.drawLine(10, 10, 150, 150);

});

Game.start();