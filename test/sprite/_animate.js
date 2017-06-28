Game.setBackdrop('#fff');

Game.set({
    width: 640,
    height: 480
});

var stitch_1 = Game.createSprite({
  	x: 200,
  	y: 240,
	costumes: [
        "./images/animate/0.gif",
        "./images/animate/1.gif",
        "./images/animate/2.gif",
        "./images/animate/3.gif",
        "./images/animate/4.gif",
        "./images/animate/5.gif",
        "./images/animate/6.gif",
        "./images/animate/7.gif",
        "./images/animate/8.gif",
        "./images/animate/9.gif",
        "./images/animate/10.gif",
        "./images/animate/11.gif",
        "./images/animate/12.gif",
        "./images/animate/13.gif",
        "./images/animate/14.gif",
        "./images/animate/15.gif",
        "./images/animate/16.gif",
        "./images/animate/17.gif"
    ]
});

var stitch_2 = Game.createSprite({
  	x: 400,
  	y: 240,
	costumes: [
        "./images/animate/0.gif",
        "./images/animate/1.gif",
        "./images/animate/2.gif",
        "./images/animate/3.gif",
        "./images/animate/4.gif",
        "./images/animate/5.gif",
        "./images/animate/6.gif",
        "./images/animate/7.gif",
        "./images/animate/8.gif",
        "./images/animate/9.gif",
        "./images/animate/10.gif",
        "./images/animate/11.gif",
        "./images/animate/12.gif",
        "./images/animate/13.gif",
        "./images/animate/14.gif",
        "./images/animate/15.gif",
        "./images/animate/16.gif",
        "./images/animate/17.gif"
    ]
});

function playAnimate () {
    stitch_1.animate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 5, playAnimate);
}
playAnimate();

stitch_2.animate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 5);

Game.start();