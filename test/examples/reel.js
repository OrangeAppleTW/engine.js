var background = Game.createSprite("assets/long_background.png");
background.scale = 0.5;
background.x = (background.width/4);
var koding = Game.createSprite("assets/koding.svg");
koding.scale = 0.3;
koding.walkStyle = true;
koding.layer = 100;
koding.y = 290;

Game.forever(function(){
    if(koding.walkStyle)
        koding.direction--;
    else
        koding.direction++;
    if(koding.direction >= 105 || koding.direction <= 75)
        koding.walkStyle = !koding.walkStyle;
  	background.x--;
});
