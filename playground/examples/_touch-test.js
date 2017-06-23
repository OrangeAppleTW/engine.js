Game.setBackdrop("#ffffff");

var robot = Game.createSprite({
  	scale: 0.3,
    direction: 100000,
  	x: 400,
  	y: 300,
	costumes: "images/robot.png"
});

var monsters = [];
for(var i=0; i<20; i++){
	var monster = Game.createSprite({
        scale: 0.2,
        x: Math.random()*640,
        y: Math.random()*480,
        costumes: "images/monster.png"
    });
	monsters.push(monster);
}

robot.forever(function(){
    this.x = Game.cursor.x;
    this.y = Game.cursor.y;
});

var attack = function(target){
    this.scale += 0.05;
  	target.destroy();
};

robot.when("touch", monsters, attack);

Game.start();