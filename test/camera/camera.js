Game.setBackdrop("./assets/background.png", 0, 0, 520, 390);

var bird = Game.createSprite("./assets/bird.png");

for (var i=0; i<100; i++) {
    var food = Game.createSprite("./assets/bird.png");
    food.x = Math.random()*1000 - 500;
    food.y = Math.random()*1000 - 500;
}

bird.when('touch', food, function(f) {
    f.destroy();
    this.scale += 0.1;
    camera.scale += 0.1;
});

Game.forever(function() {
    Game.camera.moveTo(bird);
    bird.toward(Game.cursor);
    bird.stepForward(2);
});