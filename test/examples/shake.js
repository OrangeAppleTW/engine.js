var r = 90;
var m = false;
var v = 0;
var koding = Game.createSprite("assets/koding.svg");
Game.forever(function(){
    v+=0.03;
    if(m)
        r-=v;
    else
        r+=v;
    if(r >= 105 || r <= 75)
        m = !m;
    koding.direction = r;
});