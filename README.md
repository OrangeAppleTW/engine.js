# Koding Game Engine

## About

#### Website 👍
[https://orangeappletw.github.io/engine.js/docs](https://orangeappletw.github.io/engine.js/docs)  

#### Getting Started  🎉🎉🎉
[https://orangeappletw.github.io/engine.js/docs/#start](https://orangeappletw.github.io/engine.js/docs/#start)

#### Demo  🚀
[https://orangeappletw.github.io/engine.js/demo](https://orangeappletw.github.io/engine.js/demo)

#### Games  🎮
[https://koding.school](https://koding.school)

We also support snake-case:
[https://orangeappletw.github.io/engine.js/snake-case-test.html](https://orangeappletw.github.io/engine.js/snake-case-test.html)

## Development  🔧

To start the development server with live reloading:

```bash
npm run dev
# or
yarn dev
```

## Build  📦

To build the project for production:

```bash
npm run build
# or
yarn build
```

### 注意事項
由於 koding school 的舊課程有太多 camel case & snake case 混雜的情況，我們不得不同時支援兩者的 function。
因此在 build 出 engine-snake.js 後，要在 `var engine_1 = engine;` （或類似的 code）前加上：
```
// For Koding.school old python env:
Sprite.prototype.stepForward = Sprite.prototype.step_forward;
Sprite.prototype.moveTo = Sprite.prototype.move_to;
Sprite.prototype.distanceTo = Sprite.prototype.distance_to;
Sprite.prototype.nextCostume = Sprite.prototype.next_costume;
Sprite.prototype.bounceEdge = Sprite.prototype.bounce_edge;
Sprite.prototype.getCostumeImage = Sprite.prototype.get_costume_image;

SoundNode.prototype.setVolume = SoundNode.prototype.set_volume;
SoundNode.prototype.setLoop = SoundNode.prototype.set_loop;

Sound.prototype.setVolume = Sound.prototype.set_volume;

Pen.prototype.drawShapes = Pen.prototype.draw_shapes;
Pen.prototype.drawTexts = Pen.prototype.draw_texts;
Pen.prototype.drawText = Pen.prototype.draw_text;
Pen.prototype.drawLine = Pen.prototype.draw_line;
Pen.prototype.drawCircle = Pen.prototype.draw_circle;
Pen.prototype.drawRect = Pen.prototype.draw_rect;
Pen.prototype.drawPolygon = Pen.prototype.draw_polygon;
// ================================
```
並在 engine 函式內，return proxy 前加上：
```
// For Koding.school old python env:
proxy.createSprite = proxy.create_sprite;
proxy.createSound = proxy.create_sound;
proxy.setBackground = proxy.set_background;
proxy.setBackground = proxy.set_backdrop;
proxy.drawText = proxy.draw_text;
proxy.drawBackdrop = proxy.draw_backdrop;
proxy.drawBackdrop = proxy.draw_background;
proxy.drawSprites = proxy.draw_sprites;
// ================================
```
