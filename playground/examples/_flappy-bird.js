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
bird.forever(function(){
    bird.y += bird.speed;
    bird.speed += 0.15;
});
downTube.forever(function(){
	if(this.x<-30){
        this.x = 330;
    }
    upTube.x = this.x = this.x-2;
});

bird.on("touch", ground, Game.stop);
Game.on("touch", [bird, upTube], Game.stop);
Game.on("touch", [bird, downTube], Game.stop);
Game.on("click", null, function(){
    bird.speed = -4;
});

Game.set({
    width: 320,
    height: 480
});

Game.update( function(){
    Game.drawBackdrop("./images/flappy-bird/bg.jpg",0,0,320);
    Game.drawSprites();
});

Game.preloadImages(
    [
        "./images/flappy-bird/bird.png",
        "./images/flappy-bird/up-tube.png",
        "./images/flappy-bird/down-tube.png",
        "./images/flappy-bird/ground.png",
        "./images/flappy-bird/bg.jpg"
    ],
    function(){
        console.log("Preloading complete");
        Game.start();
    }
);

Game.print("Loading....", 100, 240);