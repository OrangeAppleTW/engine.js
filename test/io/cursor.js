Game.setBackdrop("#000000");

var print = Game.print;
var cursor = Game.cursor;
Game.forever(function(){
    print('**滑鼠測試**', 100, 100, 'white');
    print('cursor.x: ' + cursor.x, 100, 130, 'white');
    print('cursor.y: ' + cursor.y, 100, 160, 'white');
    print('cursor.left: ' + cursor.left, 100, 190, 'white');
    print('cursor.right: ' + cursor.right, 100, 220, 'white');
    print('cursor.isDown: ' + cursor.isDown, 100, 250, 'white');
});