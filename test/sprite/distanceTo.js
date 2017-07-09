var bird_1 = Game.createSprite("./assets/bird.png");
var bird_2 = Game.createSprite("./assets/bird.png");

Game.forever(function() {
    bird_1.moveTo(Game.cursor);
    Game.print(bird_1.distanceTo(bird_2), 10, 10, 'red', 30);
});