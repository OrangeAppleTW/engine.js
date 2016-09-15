# Koding Game Engine

```javascript
var Game = Engine("canvas-id");

// 設定遊戲數值
Game.set({
    width: 400, // Default: 640px
    height: 400, // Default: 480px
    ratio: 0.8, // Default: 1
    gravity: 9.8, // Default: 0
    frameFunc: function(){}
});

Game.stop();
Game.start();

// 遊戲 Canvas 的 context 物件
Game.ctx; //

// 存放所有角色的物件
Game.sprites; // {}

// 創造新角色
Game.createSprite({
    x: 0,
    y: 0
});

// 移除遊戲中的所有角色
Game.clearSprites();

//
Game.print(text, x, y, color, size, font);

// Draw all sprites in Game.sprites on canvas
Game.drawSprites();

// Draw all sprites in Game.sprites on canvas
Game.drawBackdrop("./images/backGround.jpg");

// Current cursor position
Game.cursor; // {x:0, y:0}

// 取得目前的 FPS
Game.inspector.fps; // 58

// 綁定事件
Game.on("click", Game.sprites.hero, function(){ /* Do something */ });
Game.on("hover", Game.sprites.hero, function(){ /* Do something */ });
Game.on("keydown", "w", function(){ /* Do something */ });
Game.on("keyup", "w", function(){ /* Do something */ });

```