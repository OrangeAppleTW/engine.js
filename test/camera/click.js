Game.setBackdrop("./assets/background.png", 0, 0, 520, 390);


for (var i=0; i<100; i++) {
    var f = Game.createSprite("./assets/bird.png");
    f.x = i*20;
    f.y = i*20;
    f.when('click', function() {
        this.destroy();
    });
}

Game.camera.x += 100;