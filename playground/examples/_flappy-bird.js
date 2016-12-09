var bird = Game.createSprite({
    x: 160,
    y: 240,
    costumes: "./images/flappy-bird/bird.png"
});
var upTube = Game.createSprite({
    x: 320,
    y: 0,
    costumes: "./images/flappy-bird/up-tube.png"
});
var downTube = Game.createSprite({
    x: 320,
    y: 440,
    costumes: "./images/flappy-bird/down-tube.png"
});
var ground = Game.createSprite({
    x: 160,
    y: 460,
    costumes: "./images/flappy-bird/ground.png"
});
var bgMusic = Game.sound.play("./assets/happy.mp3");
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

bird.when("touch", ground, Game.stop);
Game.when("touch", [bird, upTube], Game.stop);
Game.on("touch", [bird, downTube], Game.stop);
Game.on("click", null, function(){
    Game.sound.play("./assets/laser1.wav");
    bird.speed = -4;
});


Game.on("keydown","space",function(){bgMusic.pause();})

Game.set({
    width: 320,
    height: 480
});

Game.update( function(){
    Game.drawBackdrop("./images/flappy-bird/bg.jpg",0,0,320);
    Game.drawSprites();
    Game.print(Game.inspector.fps, 280, 20);
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