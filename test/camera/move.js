Game.setBackdrop("./assets/background.png", 0, 0, 520, 390);

var bird = Game.createSprite("./assets/bird.png");
var food = [];

for (var i=0; i<100; i++) {
    var f = Game.createSprite("./assets/bird.png");
    f.x = Math.random()*1000 - 500;
    f.y = Math.random()*1000 - 500;
    food.push(f);
}

bird.when('touch', food, function(f) {
    f.destroy();
    this.scale += 0.1;
    Game.camera.scale += 0.1;
});

Game.forever(function() {
    Game.camera.moveTo(bird);
    if (Game.key.up) bird.y -= 1;
    if (Game.key.down) bird.y += 1;
    if (Game.key.left) bird.x -= 1;
    if (Game.key.right) bird.x += 1;
});