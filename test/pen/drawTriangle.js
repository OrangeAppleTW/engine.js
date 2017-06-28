Game.setBackdrop('white');

var pen = Game.pen;

Game.forever(function() {

    pen.color = 'blue';
    pen.size = 6;
    pen.drawTriangle(200, 200, 300, 300, 200, 300);

});

Game.start();