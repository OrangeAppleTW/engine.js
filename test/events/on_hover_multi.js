var birds = [];

for(var i=0; i<100; i++) {
    var b = Game.createSprite('./assets/bird.png');
    b.x = Math.random()*1200;
    b.y = Math.random()*900;
    birds.push(b);
}

Game.on('hover', birds, function() {
    this.scale += 0.03;
});