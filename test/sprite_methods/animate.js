var bird_1 = Game.createSprite(["./assets/bird_1.png", "./assets/bird_2.png", "./assets/bird_3.png"]);
bird_1.x = 200;
bird_1.y = 200;

var bird_2 = Game.createSprite(["./assets/bird_1.png", "./assets/bird_2.png", "./assets/bird_3.png"]);
bird_2.x = 200;
bird_2.y = 400;

function playAnimate () {
    bird_1.animate([0, 1, 2, 1], 5, playAnimate);
}
playAnimate();

bird_2.animate([0, 1, 2, 1], 5);