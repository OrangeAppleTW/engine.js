setBackdrop("#000000");
forever(function(){

    var y = 80

    print('**滑鼠測試**', 30, y, 'white');
    print('cursor.x: ' + cursor.x, 30, y+ 20, 'white');
    print('cursor.y: ' + cursor.y, 30, y + 2*20, 'white');
    print('cursor.left: ' + cursor.left, 30, y + 3*20, 'white');
    print('cursor.right: ' + cursor.right, 30, y + 4*20, 'white');
    print('cursor.isDown: ' + cursor.isDown, 30, y + 5*20, 'white');
});