Game.set({
    width: 640,
    height: 480
});

var robot = Game.createSprite({
  	scale: 0.3,
  	x: 400,
  	y: 300,
	costumes: "images/robot.png"
});

var monster = Game.createSprite({
  	scale: 0.4,
  	x: 80,
  	y: 300,
	costumes: "images/monster.png"
});
monster.hp=100;

monster.forever(function(){
    this.x = Game.cursor.x;
    this.y = Game.cursor.y;
});

var attack = function(){
    console.log("Hey!");
  	monster.hp -= 50;
};

robot.when("touch", monster, attack);

Game.forever(function(){
	Game.drawBackdrop("#ffffff");
  	Game.drawSprites();
});

Game.start();