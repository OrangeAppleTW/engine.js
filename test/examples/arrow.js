var soccer = Game.createSprite("assets/soccer.png");
var key = Game.key;
Game.forever(function(){
	if(key.up)
      soccer.y--;
  	if(key.down)
      soccer.y++;
  	if(key.left)
      soccer.x--;
  	if(key.right)
      soccer.x++;
  	if(key.up || key.right)
      soccer.direction++;
  	if(key.down || key.left)
      soccer.direction--;
});
