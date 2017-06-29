var bird_1 = Game.createSprite({
    costumes: ["./assets/bird_1.png", "./assets/bird_2.png", "./assets/bird_3.png"],
    x: 100,
    y: 200
});
var bird_2 = Game.createSprite({
    costumes: ["./assets/bird_1.png", "./assets/bird_2.png", "./assets/bird_3.png"],
    x: 300,
    y: 200
});

function playAnimate () {
    bird_1.animate([0, 1, 2, 1], 5, playAnimate);
}
playAnimate();

bird_2.animate([0, 1, 2, 1], 5);