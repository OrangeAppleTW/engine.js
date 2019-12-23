var bird = createSprite("./assets/bird.png");

forever(function() {
    bird.toward(cursor);
});