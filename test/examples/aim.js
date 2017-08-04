var gen_amout = 10;
var animals = [];
var target = Game.createSprite(["assets/target.png", "assets/target_a.png"]);
target.forever(function(){
	this.moveTo(Game.cursor);
});
target.forever(function(){
    if(this.touched(animals))
        this.costumeId = 1;
    else
        this.costumeId = 0;
});
target.layer = 100;
while(gen_amout--){
    var animal = Game.createSprite(["assets/zombie.png", "assets/skeleton.png", "assets/bear.png"]);
    animal.moveTo(
        Math.floor(Math.random()*481),
        Math.floor(Math.random()*361)
    );
    animal.costumeId = Math.floor(Math.random()*3);
  	animals.push(animal);
}
Game.when("click", function(){
    for(var i = 0; i < animals.length; i++){
        if(animals[i].touched(target)){
            animals[i].destroy();
        }
    }
});