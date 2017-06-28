Game.setBackdrop('white');

var pen = Game.pen;

Game.forever(function() {

    pen.color = 'yellow';
    pen.size = 4;
    pen.drawRect(400, 40, 200, 100);

});

Game.start();