var pen = Game.pen;

pen.color = "red";
pen.size = 5;

Game.forever(function() {
    pen.fillColor = "orange";
    pen.drawRect(10, 10, 100, 100);
    
    pen.fillColor = "yellow";
    pen.drawTriangle(170, 10, 220, 110, 120, 110);

    pen.fillColor = "pink";
    pen.drawCircle(280, 60, 50);
});