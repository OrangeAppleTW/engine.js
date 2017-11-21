var road = Game.createSprite("assets/road.png");
var car = Game.createSprite("assets/86.png");
var speed = 0;

car.scale = 0.2;

Game.forever(function() {
    if (Game.key.left) car.direction -= 3;
    if (Game.key.right) car.direction += 3;

    if (speed < 10) speed += 0.05;
    if (car.touched(road) && speed > 0.3) speed -= 0.3;
    car.stepForward(speed);

    Game.camera.moveTo(car);
});