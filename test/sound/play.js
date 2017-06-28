var bird = createSprite("./assets/bird.png");

bird.when('click', function () {
    sound.play("./assets/BonusCube.mp3");
});