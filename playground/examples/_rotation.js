Game.setBackdrop("#ffffff");

var monster = Game.createSprite("./images/monster.png");

Game.forever(function(){
    monster.toward(Game.cursor); 
    Game.print("Degree: "+monster.direction);
});
Game.start();