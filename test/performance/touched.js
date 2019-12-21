const birds = [];

for (var i=0; i<100; i++) {
    let b = Game.createSprite('./assets/bird.png');
    b.x = Math.random()*400;
    b.y = Math.random()*400;
    b.direction = Math.random()*360;
    birds.push(b);
}


Game.forever(() => {
    var a = 0;
    var b = 0;
    birds.forEach((bird) => {
        bird.opacity = 0.5;
        bird.stepForward(5);
        bird.bounceEdge();

        birds.forEach((target) => {
            if(bird.touched(target)) {
                b++;
                bird.opacity = 1;
            }
            a++;
            
        });
    });

    Game.print('aabb:' + a, 10, 10);
    Game.print('pixel:' + b, 10, 40);
    Game.print('fps:' + Game.inspector.fps, 10, 70);
});