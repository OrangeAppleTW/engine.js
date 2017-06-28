Game.setBackdrop('white');

var pen = Game.pen;

Game.forever(function() {

    pen.fillColor = 'red';
    pen.size = 60;
    pen.drawText('測試123', 100, 100);
    pen.fill = null;

});

Game.start();