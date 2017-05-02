Game.setBackdrop("#000000");

Game.forever(function(){

    var y = 80

    Game.print('**滑鼠測試**', 30, y, 'white');
    Game.print('cursor.x: ' + Game.cursor.x, 30, y+ 20, 'white');
    Game.print('cursor.y: ' + Game.cursor.y, 30, y + 2*20, 'white');
    Game.print('cursor.left: ' + Game.cursor.left, 30, y + 3*20, 'white');
    Game.print('cursor.right: ' + Game.cursor.right, 30, y + 4*20, 'white');
    Game.print('cursor.isDown: ' + Game.cursor.isDown, 30, y + 5*20, 'white');

    Game.print('**鍵盤測試**', 30, y + 8*20, 'white');
    Game.print('key.q: ' + Game.key.q, 30, y + 9*20, 'white');
    Game.print('key.w: ' + Game.key.w, 30, y + 10*20, 'white');
    Game.print('key.e: ' + Game.key.e, 30, y + 11*20, 'white');
    Game.print('key.r: ' + Game.key.r, 30, y + 12*20, 'white');
});

Game.start();