Game.setBackdrop("#000000");

var print = Game.print;
var cursor = Game.cursor;
Game.forever(function(){
    print('cursor.x: ' + cursor.x, 10, 10, 'white', 30);
    print('cursor.y: ' + cursor.y, 10, 50, 'white', 30);
});

on('click', function () {
    Game.set({
        width: Number(prompt('stage width?')),
        height: Number(prompt('stage height?')),
    })
});