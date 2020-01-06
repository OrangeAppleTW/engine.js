const birds = [];
var precision = 1;
Game.set({ precision });

for (var i=0; i<100; i++) {
    let b = Game.createSprite('./assets/bird.png');
    b.x = Math.random()*1200;
    b.y = Math.random()*900;
    b.direction = Math.random()*360;
    birds.push(b);
    b.scale = 0.5;
}

on('click', function () {
    precision = Number(prompt('precision?'));
    Game.set({ precision });
});

Game.forever(() => {
    var a = 0;
    var b = 0;
    var c = 0;
    birds.forEach((bird) => {
        bird.opacity = 0.5;
        bird.stepForward(5);
        bird.bounceEdge();

        birds.forEach((target) => {
            if(bird.touched(target)) {
                c++;
                bird.opacity = 1;
            }
            if (bird !== target) b++;
            a++;
            
        });
    });
    Game.print('precision' + precision, 10, 10, 'black', 30)
    Game.print('sprites: ' + birds.length, 10, 50, 'black', 30);
    Game.print('touched: ' + a, 10, 90, 'black', 30);
    Game.print('AABBJudger: ' + b, 10, 130, 'black', 30);
    Game.print('pixelJudger: ' + c, 10, 170, 'black', 30);
    Game.print('fps: ' + Game.inspector.fps, 10, 210, 'black', 30);
});