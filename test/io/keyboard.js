Game.setBackdrop("#000000");

var print = Game.print;
var key = Game.key;
Game.forever(function(){
    print('**鍵盤測試**',             100, 30,  'white');
    print('key.q: '     + key.q,     100, 60,  'white');
    print('key.w: '     + key.w,     100, 90,  'white');
    print('key.e: '     + key.e,     100, 120, 'white');
    print('key.r: '     + key.r,     100, 150, 'white');
    print('key.up: '    + key.up,    100, 180, 'white');
    print('key.down: '  + key.down,  100, 210, 'white');
    print('key.left: '  + key.left,  100, 240, 'white');
    print('key.right: ' + key.right, 100, 270, 'white');
    print('key.space: ' + key.space, 100, 300, 'white');
});