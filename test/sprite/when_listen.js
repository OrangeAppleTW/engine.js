var bird = Game.createSprite("./assets/bird.png");

bird.when('listen', 'gameOver', function () {
    this.destroy();
});

Game.when("mousedown", function () {
    Game.broadcast("gameOver");
});