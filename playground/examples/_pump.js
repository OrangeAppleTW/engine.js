Game.set({
    width: 640,
    height: 480
});

var slime = Game.createSprite({
	x: 320,
  	y: 240,
  	costumes:["images/slime.gif"]
});

slime.when("hover",function(){
	slime.scale+=0.1;
});

// 可以使用 always
Game.always(function(){
    Game.drawBackdrop("#ffffff");
})
// 或是 forever 來運行重複迴圈
Game.forever(function(){
	Game.drawSprites();
})

Game.start()