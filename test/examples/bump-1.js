var soccer = Game.createSprite("assets/soccer.png");
var v = soccer.height/2;
Game.forever(function(){
    v+=0.25;
    soccer.move(0,v);
    if(soccer.y >= 400){
        v=-10;
    }
});