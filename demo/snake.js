var Game = Engine('game-canvas');

const canvasWidth = 640;
const canvasHeight = 480;

Game.set({
    width: canvasWidth, // 確保與 HTML canvas 尺寸匹配
    height: canvasHeight,
    debugMode: true,
    precision: 4
});


// --- 資源預載入 ---
Game.preload(['./snake/snake.png','./snake/apple.png'], () => {
    console.log("資源加載完畢");
    Game.start(); // 確保引擎內部狀態準備就緒
});

var snakeHead = Game.createSprite('./snake/snake.png');
snakeHead.x = 240;
snakeHead.y = 320;
var snakeBodies = [];
var apples = [];
function spawnApple(x=null,y=null){
    let apple = Game.createSprite('./snake/apple.png');
    apple.x = x || Math.floor(Math.random() * canvasWidth / 20) * 20;
    apple.y = y || Math.floor(Math.random() * canvasHeight / 20) * 20;
    apple.on('touch',snakeHead,function(){
        apple.destroy();
        spawnApple();
    });
    apples.push(apple);
}
spawnApple(40,40);

var timer = 0;

// var apple = Game.createSprite('./snake/apple.png');
// --- 遊戲循環 (由 Game.forever 調用) ---
Game.forever(function() { 
    timer++;
    if (timer % 10 === 0) {
        moveSnake();
    }
});

// --- 移動邏輯 ---
function moveSnake() {

    var snakeHeadOriginalPosition = {
        x: snakeHead.x,
        y: snakeHead.y
    };

    snakeHead.stepForward(20);

    if(snakeHead.touched(apples)){
        let newBody = Game.createSprite('./snake/snake.png');
        newBody.x = snakeHeadOriginalPosition.x;
        newBody.y = snakeHeadOriginalPosition.y;
        snakeBodies.push(newBody);  
    } else {
        // 如果有蛇身，將最早的蛇身移動到蛇頭原來的位置，並重新放到數組末尾
        if (snakeBodies.length > 0) {
            let firstBody = snakeBodies.shift(); // 取出最早的蛇身
            firstBody.x = snakeHeadOriginalPosition.x;
            firstBody.y = snakeHeadOriginalPosition.y;
            snakeBodies.push(firstBody); // 放到數組末尾
        }
    }
    if(snakeHead.touched(snakeBodies)){
        Game.stop();
    }
}

Game.on("keydown","right",function(){
    snakeHead.direction = 90;
});
Game.on("keydown","left",function(){
    snakeHead.direction = 270;
});
Game.on("keydown","up",function(){
    snakeHead.direction = 0;
});
Game.on("keydown","down",function(){
    snakeHead.direction = 180;
});
