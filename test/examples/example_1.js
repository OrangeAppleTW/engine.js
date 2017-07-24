var bird = Game.createSprite("assets/bird.png");
var speed = 10;
Game.forever(function() {
    bird.y += speed;
    if (bird.y > 350 && speed > 0) {
        speed = -speed;
    }
  	speed += 0.8;
});