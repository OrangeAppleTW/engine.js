var bird = Game.sprites.bird = Game.createSprite({
    x: 160,
    y: 240,
    costumes: "./images/flappy-bird/bird.png"
});
var upTube = Game.sprites.upTube = Game.createSprite({
    x: 320,
    y: 0,
    costumes: "./images/flappy-bird/up-tube.png"
});
var downTube = Game.sprites.downTube = Game.createSprite({
    x: 320,
    y: 440,
    costumes: "./images/flappy-bird/down-tube.png"
});
var ground = Game.sprites.ground = Game.createSprite({
    x: 160,
    y: 460,
    costumes: "./images/flappy-bird/ground.png"
});
bird.speed = 1;

Game.on("click", null, function(){
    bird.speed = -4;
});

Game.set({
    width: 320,
    height: 480
});

Game.draw( function(){
    Game.drawBackdrop("./images/flappy-bird/bg.jpg",0,0,320)
    if(downTube.x<-30){
        downTube.x = 330;
    }
    upTube.x = downTube.x = downTube.x-2;
    bird.y += bird.speed;
    bird.speed += 0.15;
    Game.drawSprites();
    if( bird.touched(ground) || bird.touched(upTube) || bird.touched(downTube)){
        Game.stop();
    }
});

Game.start();