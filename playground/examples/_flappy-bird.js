var bird = Game.sprites.bird = Game.createSprite({
    x: 320,
    y: 240,
    costumes: "./images/slime.gif"
});
var upTube = Game.sprites.upTube = Game.createSprite({
    x: 640,
    y: 0,
    costumes: "./images/up-tube.png"
});
var downTube = Game.sprites.downTube = Game.createSprite({
    x: 640,
    y: 440,
    costumes: "./images/down-tube.png"
});
var ground = Game.sprites.ground = Game.createSprite({
    x: 320,
    y: 460,
    costumes: "./images/ground.png"
});
bird.speed = 1;

Game.on("click", null, function(){
    bird.speed = -4;
});

function frameFunc() {
    if(downTube.x<-30){
        downTube.x = 670;
    }
    upTube.x = downTube.x = downTube.x-2;
    bird.y += bird.speed;
    bird.speed += 0.15;
    Game.drawSprites();
    if(bird.isCollidedTo(ground)){
        Game.stop();
    }
}

Game.setFrameFunc(frameFunc);
Game.start();