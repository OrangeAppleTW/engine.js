Game.set({
    width: 640,
    height: 480
});
Game.setBackdrop("#ffffff");

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
  	// 碰撞時執行的function會在 object 的 scope
    console.log(this);
  	monster.hp -= 50;
};

robot.when("touch", monster, attack);

Game.start();