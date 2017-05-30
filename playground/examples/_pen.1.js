Game.setBackdrop('#333');

var pen = Game.pen;

Game.forever(function() {

    pen.fill = 'white';
    pen.size = 60;
    pen.drawText('測試123', 320, 240);
    pen.fill = null;

    pen.color = 'red';
    pen.size = 10;
    pen.drawLine(10, 10, 150, 150);

    pen.color = 'green';
    pen.size = 8;
    pen.drawCircle(200, 100, 100);

    pen.color = 'blue';
    pen.size = 6;
    pen.drawTriangle(200, 200, 300, 300, 200, 300);

    pen.color = 'yellow';
    pen.size = 4;
    pen.drawRect(400, 40, 200, 100);

    pen.color = 'pink';
    pen.size = 2;
    pen.drawPolygon([320, 240, 520, 120, 520, 420, 100, 400, 100, 200]);

});

Game.start();