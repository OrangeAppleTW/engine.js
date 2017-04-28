Game.setBackdrop("#000000");

Game.forever(function(){

    Game.print('**滑鼠測試**', 30, 80, 'white');
    Game.print('cursor.x: ' + Game.cursor.x, 30, 100, 'white');
    Game.print('cursor.y: ' + Game.cursor.y, 30, 120, 'white');
    Game.print('cursor.isDown: ' + Game.cursor.isDown, 30, 140, 'white');

    Game.print('**鍵盤測試**', 30, 180, 'white');
    Game.print('keyboard.q: ' + Game.keyboard.q, 30, 200, 'white');
    Game.print('keyboard.w: ' + Game.keyboard.w, 30, 220, 'white');
    Game.print('keyboard.e: ' + Game.keyboard.e, 30, 240, 'white');
    Game.print('keyboard.r: ' + Game.keyboard.r, 30, 260, 'white');
});

Game.start();