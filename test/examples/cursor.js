var bird = Game.createSprite("assets/bird.png");
var cursor = Game.cursor;
Game.forever(function(){
    bird.toward(cursor); 
    bird.stepForward(3);
});
