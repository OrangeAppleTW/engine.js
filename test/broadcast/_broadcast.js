Game.setBackdrop('#000000');

var score = 0;
var life = 0;

var start = Game.createSprite({
    x: 320,
    y: 250,
    costumes: "/playground/images/flappy-bird/start-button.png"
});

start.on('click', function() {
    startGame();
    Game.broadcast('start');
    this.hidden = true;
});

start.on('listen','gameOver', function () {
    this.hidden = false;
});

var gameOver = Game.createSprite({
    x: 320,
    y: 310,
    costumes: "/playground/images/flappy-bird/gameover.png"
});
gameOver.hidden = true;

gameOver.on('listen','start', function () {
    this.hidden = true;
});

gameOver.on('listen','gameOver', function () {
    this.hidden = false;
});

var flyswatter = Game.createSprite({
    x: 100,
    y: 100,
    costumes: "/playground/images/flyswatter.png"
});
flyswatter.hidden = true;

flyswatter.on('listen','start', function () {
    this.hidden = false;
});

flyswatter.on('listen','gameOver', function () {
    this.hidden = true;
});

var flies = [];

function startGame() {
    score = 0;
    life = 34;
    var i = 10;
    while(i--) {
        var fly = Game.createSprite({
            x: Math.random()*640,
            y: Math.random()*640,
            direction: Math.random()*360,
            costumes: "/playground/images/flappy-bird/bird.png"
        });

        fly.layer = 1;

        fly.clock = 0;

        fly.move = function () {
            this.clock++;
            this.stepForward(6);
            if(this.clock%10) this.direction += Math.random() * 60 - 30;

            if(this.x > 640) this.x -= 640;
            if(this.x < 0) this.x += 640;
            if(this.y > 480) this.y -= 480;
            if(this.y < 0) this.y += 480;
        }

        fly.kill = function () {
            score += 1;
            life += 1;
            this.x = Math.random()*640;
            this.y= Math.random()*640;
        }

        fly.on('listen', 'gameOver', function () {
            this.destroy();
        });

        flies.push(fly);
    }
}

Game.on('click', function() {
    for(var i=0; i<flies.length; i++) {
        if(flyswatter.touched(flies[i])) {
            flies[i].kill();
        }
    }
    life -= 4;
});

Game.forever(function() {
    if(life < 0) life = 0;
    Game.print('score: ' + score, 10, 10, 'red', 20);
    Game.print('life: ' + Math.round(life), 10, 40,'red', 20);
    flyswatter.x = Game.cursor.x;
    flyswatter.y = Game.cursor.y;
    flies.forEach(function(b) {b.move()});
    if(life <= 0) Game.broadcast('gameOver');
});

Game.start();