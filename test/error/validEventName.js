var bird = Game.createSprite('./assets/bird.png');

Game.on('blablabla', bird, () => {});

Game.on('touch', bird, bird, () => {});
Game.on('click', bird, () => {});
Game.on('mouseup', bird, () => {});
Game.on('mousedown', bird, () => {});
Game.on('hover', bird, () => {});
Game.on('keydown', bird, () => {});
Game.on('keyup', bird, () => {});
Game.on('holding', bird, () => {});

