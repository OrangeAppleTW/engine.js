setBackdrop('./assets/background.jpg');

var bird = createSprite('./assets/bird.png');

var p1 = createSprite('./assets/pipes.png');
var p2 = createSprite('./assets/pipes.png');
var p3 = createSprite('./assets/pipes.png');
p1.x = 1200;
p2.x = 1700;
p3.x = 2200;
p1.y = Math.random()*600 + 150;
p2.y = Math.random()*600 + 150;
p3.y = Math.random()*600 + 150;

var pipes = [p1, p2, p3];

forever(function () {
    updatePipes();
});

function updatePipes () {
    for (var i=0; i<3; i++) {
        pipes[i].x -= 5;
        if (pipes[i].x < -100) {
            pipes[i].x += 1500;
            pipes[i].y = 100 + Math.random()*700;
        }
    }
}