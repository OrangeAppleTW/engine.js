Game.setBackdrop("#000000");

var print = Game.print;
var cursor = Game.cursor;
Game.forever(function(){
    print('**滑鼠測試**', 100, 100, 'white', 30);
    print('cursor.x: ' + cursor.x, 100, 200, 'white', 30);
    print('cursor.y: ' + cursor.y, 100, 300, 'white', 30);
    print('cursor.left: ' + cursor.left, 100, 400, 'white', 30);
    print('cursor.right: ' + cursor.right, 100, 500, 'white', 30);
    print('cursor.isDown: ' + cursor.isDown, 100, 600, 'white', 30);
});