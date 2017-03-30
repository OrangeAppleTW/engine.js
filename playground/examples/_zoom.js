Game.setBackdrop("#ffffff");

var monster = Game.createSprite({
  x: 300,
  y: 240,
  scale: .5,
  costumes: ["./images/monster.png"]
});
var scale = .5;
var add = 0.001;
Game.forever(function(){
  if(scale < 0.1 || scale >.6) add = -add;
  monster.direction += 1;
  Game.set({zoom: (scale += add )})
});
monster.on('hover', function() {
	Game.print('mouse hover', 10, 10, 'red', 50);
})
Game.start();