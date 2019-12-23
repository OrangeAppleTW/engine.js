Game.setBackdrop("#000000");

var print = Game.print;
var key = Game.key;
Game.forever(function(){
    print('keyboard',                200, 50,  'white', 30);
    print('key.q: '     + key.q,     200, 100, 'white', 30);
    print('key.w: '     + key.w,     200, 150, 'white', 30);
    print('key.e: '     + key.e,     200, 200, 'white', 30);
    print('key.r: '     + key.r,     200, 250, 'white', 30);
    print('key.up: '    + key.up,    200, 300, 'white', 30);
    print('key.down: '  + key.down,  200, 350, 'white', 30);
    print('key.left: '  + key.left,  200, 400, 'white', 30);
    print('key.right: ' + key.right, 200, 450, 'white', 30);
    print('key.space: ' + key.space, 200, 500, 'white', 30);
});