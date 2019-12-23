var bird = createSprite(["./assets/bird_1.png", "./assets/bird_2.png", "./assets/bird_3.png"]);

bird.forever(function () {
    this.nextCostume();
})