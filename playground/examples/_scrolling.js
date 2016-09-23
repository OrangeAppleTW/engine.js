var bird = Game.sprites.bird = Game.createSprite({
    x: 160,
    y: 240,
    costumes: "./images/flappy-bird/bird.png"
});

var bgPosition = {x:0, y:0};

Game.on("holding", "right", function(){
    bgPosition.x -= 4;
});

Game.on("holding", "left", function(){
    bgPosition.x += 4;
});

Game.set({
    width: 320,
    height: 480
});

Game.update( function(){
    Game.drawBackdrop("./images/scrolling/bg.jpg",bgPosition.x,bgPosition.y)
    // if(downTube.x<-30){
    //     downTube.x = 330;
    // }
    // upTube.x = downTube.x = downTube.x-2;
    // bird.y += bird.speed;
    // bird.speed += 0.15;
    Game.drawSprites();
    // if( bird.touched(ground) || bird.touched(upTube) || bird.touched(downTube)){
    //     Game.stop();
    // }
});

Game.start();