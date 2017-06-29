var bird = Game.createSprite("./assets/bird.png");

Game.forever(function() {
    bird.toward(Game.cursor);
});