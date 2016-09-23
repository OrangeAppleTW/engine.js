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
    Game.drawSprites();
});

Game.preloadImages(
    [
        "./images/flappy-bird/bird.png",
        "./images/scrolling/bg.jpg"
    ],
    function(){
        Game.start();
    }
);

Game.print("Loading....", 100, 240);