var koding = Game.createSprite("assets/koding.svg");
koding.rotationStyle = 'flipped';
koding.scale = 0.5;
koding.y = 360 - koding.height/2;
var key = Game.key;
Game.forever(function(){
  	if(key.left){
        koding.x--;
        koding.direction = 270;
    }else if(key.right){
        koding.x++;
        koding.direction = 90;
    }
    if(koding.y > 0){
        koding.y--;
    }
});