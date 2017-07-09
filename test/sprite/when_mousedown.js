var bird = Game.createSprite("./assets/bird.png");

bird.when('mousedown', function () {
    this.scale += 1;
});