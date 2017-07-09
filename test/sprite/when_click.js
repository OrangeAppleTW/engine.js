var bird = Game.createSprite("./assets/bird.png");

bird.when('click', function () {
    this.scale += 1;
});