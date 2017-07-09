var bird = Game.createSprite("./assets/bird.png");

bird.when('mouseup', function () {
    this.scale += 1;
});