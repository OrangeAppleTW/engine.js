var bird = Game.createSprite('assets/bird.png');

Game.when('holding', 'right', function() {
    bird.x += 5;
});
Game.when('holding', 'left', function() {
    bird.x -= 5;
});
Game.when('holding', 'up', function() {
    bird.y -= 5;
});
Game.when('holding', 'down', function() {
    bird.y += 5;
});