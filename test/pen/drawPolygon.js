Game.setBackdrop('white');

var pen = Game.pen;

Game.forever(function() {

    pen.color = 'pink';
    pen.size = 2;
    pen.drawPolygon(320, 240, 520, 120, 520, 420, 100, 400, 100, 200);

});

Game.start();