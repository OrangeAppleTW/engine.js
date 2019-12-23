

for (let i=0; i<100; i++) {
    let bird = Game.createSprite('assets/bird.png');
    bird.x = Math.random()*1200;
    bird.y = Math.random()*900;
    Game.when('keydown', 'space', bird, function() {
        bird.scale += 0.2;
        if (Math.random() < 0.1) bird.destroy();
    });
}