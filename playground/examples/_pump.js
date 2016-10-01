Game.set({
    width: 640,
    height: 480
});

var slime = Game.createSprite({
	x: 320,
  	y: 240,
  	costumes:["images/slime.gif"]
});

Game.sprites.slime = slime;

slime.when("hover",function(){
	slime.scale+=0.1;
});

Game.update(function(){
    Game.drawBackdrop("#ffffff");
	Game.drawSprites();
})

Game.start()