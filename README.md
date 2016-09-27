# Koding Game Engine

## 遊戲初始化
```javascript
var Game = Engine("canvas-id");

// 設定遊戲數值
Game.set({
    width: 400, // Default: 640px
    height: 400, // Default: 480px
    ratio: 0.8, // Default: 1
    update: function(){}, // 每次刷新畫面都要做的事放這裡
    debugMode: true // Default: false
});
```

## 角色
### 創造新角色
```javascript
// 創造新角色
var slime = Game.createSprite({
    x: 200,
    y: 200,
    scale: 1.2, // 1.2倍大
    costumes: ["./slime.gif"]
});

// 存放所有角色的物件
Game.sprites; // {}

Game.sprites.slime = slime;

// 移除遊戲中的所有角色
// Game.clearSprites();
```

### 角色的特徵
```javascript
slime.x;
slime.y;
slime.direction;
slime.scale;
slime.costumes;
slime.currentCostumeId;
slime.width;
slime.height;
slime.hidden;
```

### 角色的方法
```javascript
slime.moveTo(160, 200);
slime.move(10, 0);
slime.stepForward(4);
slime.toward(sprite1);

slime.always(function(){/* Do this every tick */}); // Later callback will cover the previous one.
slime.forever(function(){/* Do this every tick */}); // Alias to always

slime.touched(sprite1); // Return Boolean
slime.touched(40, 160); // Return Boolean
slime.distanceTo(sprite1); // Return number
slime.distanceTo({x:0, y:0}); // Return number
slime.distanceTo(0, 0); // Return number

slime.on("click",function(){});
slime.on("hover",function(){});
slime.on("touch", sprite1, function(){});
slime.on("touch", [sprite1, sprite2], function(){}); // 同時碰到兩個角色
slime.when("EventName", target, function(){}); // Alias to Sprite.on

slime.destroy(); // Destroy it-self. (Will be deleted later in the same tick )
```

## IO & Events
```javascript
// Current cursor position
Game.cursor; // {x:0, y:0}

// 取得目前的 FPS
Game.inspector.fps; // 58

// 綁定事件
Game.on("click", Game.sprites.hero, function(){ /* Do something */ });
Game.on("hover", Game.sprites.hero, function(){ /* Do something */ });
Game.on("keydown", "w", function(){ /* Do something */ });
Game.on("keyup", "space", function(){ /* Do something */ });
Game.on("holding", "right", function(){ /* Do something */ });
Game.on("touch", [sprite1, sprite2], function(){ /* Do something */ });
Game.on("touch", [sprite1, sprite2, sprite3], function(){ /* Do something */ }); // 三個角色同時碰在一起
Game.when("EventName", target, function(){}); // Alias to Game.on
```


## Rendering

```javascript
Game.preloadImages(
    [path1, path2, path3],
    completeCallback,
    progressCallback
);

Game.update(function(){

  Game.drawBackdrop("./images/backGround.jpg");
  Game.drawBackdrop("#000000");

  Game.print(text, x, y, color, size, font);

  // Draw all sprites in Game.sprites on canvas
  Game.drawSprites();
});

Game.start();

Game.stop();

Game.clear();
```

你也可以拿 context 物件自由畫出你要畫的東西
可以查看 CanvasRenderingContext2D 的 [API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
```javascript
Game.ctx;
```
