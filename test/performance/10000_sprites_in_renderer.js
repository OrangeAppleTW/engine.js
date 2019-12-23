const birds = [];

for (var i=0; i<10000; i++) {
    let b = Game.createSprite('./assets/bird.png');
    b.x = Math.random()*1200;
    b.y = Math.random()*900;
    b.direction = Math.random()*360;
    birds.push(b);
    b.scale = 0.5;
}


Game.forever(() => {
    Game.print('FPS: ' + Game.inspector.fps, 10, 10, 'black', 60)
    birds.forEach((bird) => {
        bird.opacity = 0.5;
        bird.stepForward(5);
        bird.bounceEdge();
    });
});