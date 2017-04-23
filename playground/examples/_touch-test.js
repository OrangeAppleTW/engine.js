Game.set({
    width: 640,
    height: 480
});
Game.setBackdrop("#ffffff");

var monsters = [];

var robot = Game.createSprite({
  	scale: 0.3,
  	x: 400,
  	y: 300,
	costumes: "images/robot.png"
});

var monster = Game.createSprite({
  	scale: 0.2,
	costumes: "images/monster.png"
});
monster.hp=100;
monsters.push(monster);

for(var i=0; i<10; i++){
	var monster = Game.createSprite({
        scale: 0.2,
        x: Math.random()*640,
        y: Math.random()*320,
        costumes: "images/monster.png"
    });
	monsters.push(monster);
}

monster.forever(function(){
    this.x = Game.cursor.x;
    this.y = Game.cursor.y;
  	if(this.touched(monsters)){
    	this.destroy();
    }
});

var attack = function(){
  	// 碰撞時執行的function會在 object 的 scope
    console.log(this);
  	monster.hp -= 50;
};

robot.when("touch", monster, attack);

Game.start();