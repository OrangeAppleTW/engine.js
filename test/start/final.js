setBackdrop('./assets/background.jpg');
var bgm = sound.play('./assets/bgm.ogg', true);

var bird = createSprite('./assets/bird.png');

var p1 = createSprite('./assets/pipes.png');
var p2 = createSprite('./assets/pipes.png');
var p3 = createSprite('./assets/pipes.png');
var startBtn = createSprite('./assets/start-button.png');
var gameOverLogo = createSprite('./assets/gameover.png');
var ground = createSprite('./assets/ground.jpg');
p1.x = 1200;
p2.x = 1700;
p3.x = 2200;
p1.y = Math.random() * 600 + 150;
p2.y = Math.random() * 600 + 150;
p3.y = Math.random() * 600 + 150;

var vy = 0;
var scores = 0;
var pipes = [p1, p2, p3];
var running = false;

startBtn.y = 500;
gameOverLogo.y = 350;
ground.y = 880;
gameOverLogo.hidden = true;

when('click', jump);
startBtn.when('click', start);

forever(function () {
    print(scores, 10, 10, 'white', 60);
    if (!running) {
        return;
    }
    updatePipes();
    updateBird();
    if (bird.y > 900 || bird.touched(ground) || bird.touched(pipes)) {
        gameOver();
    }
});

function updatePipes() {
    for (var i = 0; i < 3; i++) {
        pipes[i].x -= 5;
        if (pipes[i].x < -100) {
            pipes[i].x += 1500;
            pipes[i].y = 100 + Math.random() * 700;
            scores++;
        }
    }
}

function updateBird() {
    bird.y += vy;
    vy += 0.5;
}

function jump() {
    vy = -8;
    sound.play('./assets/jump.ogg');
}

function start() {
    scores = 0;
    vy = 0;
    running = true;
    bird.y = 450;
    startBtn.hidden = true;
    gameOverLogo.hidden = true;
    pipes.forEach(function (p, i) {
        p.x = 1200 + 500 * i;
        p.y = 100 + Math.random() * 700;
    });
}

function gameOver() {
    running = false;
    startBtn.hidden = false;
    gameOverLogo.hidden = false;
}

