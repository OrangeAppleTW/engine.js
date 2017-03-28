var monster = Game.createSprite("./images/monster.png");
Game.forever(function(){
    Game.drawBackdrop("#ffffff");
    monster.toward(Game.cursor); 
    Game.print("Degree: "+monster.direction);
    Game.drawSprites();
});
Game.start();