setBackdrop('./assets/background.jpg');
var bgm = sound.play('./assets/bgm.ogg', true);

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

var vy = 0;
var pipes = [p1, p2, p3];

when('click', jump);

forever(function () {
    updatePipes();
    updateBird();
    if (bird.touched([p1, p2, p3])) {
        stop();
    }
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

function updateBird () {
    bird.y += vy;
    vy += 0.5;
}

function jump () { 
    vy = -8;
    sound.play('./assets/jump.ogg');
}