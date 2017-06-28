[建置中的文件]([https://orangeappletw.github.io/engine.js/playground](https://orangeappletw.github.io/engine.js/docs))



# Koding Game Engine

## 遊戲初始化
```javascript
var Game = Engine("canvas-id");

// 設定遊戲數值
Game.set({
    width: 400, // Default: 640px
    height: 400, // Default: 480px
    zoom: 0.8, // Default: 1
    update: function(){}, // 每次刷新畫面都要做的事放這裡
    debugMode: true // Default: false
});
```

## 角色
### 創造新角色
```javascript

// 創造新角色 (簡易版)
var slime = createSprite("./slime.gif");

// 創造角色&多個造型
var slim = createSprite(["./slime_1.gif","./slime_2.gif"]);

// 創造新角色 (進階設定)
var slime = createSprite({
    x: 200,
    y: 200,
  	direction: 100, // 朝向 100 度
    scale: 1.2, // 1.2倍大
    costumes: ["./slime.gif"]
});
```

### 角色的特徵
```javascript
slime.x; // x座標
slime.y; // y座標
slime.direction; // 朝向某個角度 0~359
slim.rotationStyle; // 旋轉形式："full"正常旋轉(預設), "flipped"左右翻轉, "fixed" 固定
slime.scale; // 角色縮放比例，預設 1
slime.costumes;
slime.currentCostumeId; // 角色的造型編號
slime.layer; // 繪製角色的圖層
slime.opacity; // 透明度 0 ~ 1
slime.hidden; // Notice: Sprite could still be touched or clicked when it's hidden.
```

### 角色的方法
```javascript
slime.moveTo(160, 200); // 移動到 x:160 y:200 位置
slime.move(10, 0); // 向右移動 10 步 
slime.stepForward(4); // 朝向前方移動 4 步
slime.toward(sprite1); // 朝向 sprite1 角色

slime.always(function(){/* Do this every tick */}); // Later callback will cover the previous one.
slime.forever(function(){/* Do this every tick */}); // Alias to always

// 檢測是否碰撞
slime.touched(sprite1); // Return Boolean
slime.touched(40, 160); // Return Boolean

// 角色間的距離計算
slime.distanceTo(sprite1); // Return number
slime.distanceTo({x:0, y:0}); // Return number
slime.distanceTo(0, 0); // Return number

// 角色綁定事件
slime.on("click",function(){}); // 滑鼠點擊
slime.on("hover",function(){}); // 滑鼠碰到
slime.on("touch", sprite1, function(){}); // 角色碰撞
slime.on("touch", [sprite1, sprite2], function(){}); // 碰到任何一個角色
slime.when("EventName", target, function(){}); // Alias to Sprite.on

// 刪除角色
slime.destroy(); // Destroy it-self. (Will be deleted later in the same tick )
```

## Cursor & Keyboard 

```javascript
// 滑鼠的狀態
cursor.x; // x 座標
cursor.y; // y 座標
cursor.isDown; // 是否被按下
cursor.left; // 左鍵是否被按下
cursor.right; // 右鍵是否被按下

// 鍵盤的狀態
// key[按鍵名稱] 
// 狀態為布林值，被按下為 true 放開為 false
key.up // 上
key.down // 下
key.left // 左
key.right // 右
key.space // 空白鍵
key.a // a
key.b  // b
// 更多...
```

## Events

```javascript
// 綁定事件
on("click", Game.sprites.hero, function(){ /* Do something */ });
on("hover", Game.sprites.hero, function(){ /* Do something */ });
on("keydown", "w", function(){ /* Do something */ });
on("keyup", "space", function(){ /* Do something */ });
on("holding", "right", function(){ /* Do something */ });
on("touch", [sprite1, sprite2], function(){ /* Do something */ });
on("touch", [sprite1, sprite2, sprite3], function(){ /* Do something */ }); // 三個角色同時碰在一起
when("EventName", target, function(){}); // Alias to Game.on
```

## Pen

```javascript
pen.size; // 繪筆的大小
pen.color; // 顏色
pen.fillColor; // 填充的顏色

pen.drawText(text, x, y); // 文字
pen.drawLine(x1, y1, x2, y2); // 線條
pen.drawCircle(x, y, r); // 圓形
pen.drawTriangle(x1, y1, x2, y2, x3, y3); // 三角形
pen.drawRect(x, y, width, height); // 矩形
pen.drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, ...); // 多邊形
```

## Rendering

```javascript
Game.preloadImages(
    [path1, path2, path3],
    completeCallback,
    progressCallback
);

// 每個 Tick 要執行的程式，在一個程式中可以有好幾個
Game.update(function(){

  Game.drawBackdrop("./images/backGround.jpg", x, y, width, height);
  Game.drawBackdrop("#000000");

  Game.print(text, x, y, color, size, font);

  // Draw all sprites in Game.sprites on canvas
  Game.drawSprites();
});

//Alias to update:
Game.forever();
Game.always();

Game.start();

Game.stop();

Game.clear();
```
## Sounds

```javascript
sound.play("shoot.wav"); // 直接播放音效
var BgMusic = sound.play("music.mp3"); // 將 audio 物件存下來，以便後續的操作
BgMusic.loop = true; // 音效不斷重複播放
sound.setVolume(0.5); // 設定音量 0~1
sound.mute(true); // 靜音
sound.stop(); // 暫停所有音效
```
## inspector

```javascript
// 取得目前的 FPS
inspector.fps;
```

