var ver = Game.createSprite('./assets/gameover.png');

Game.when("click", function() {
    ver.hidden = !ver.hidden;
});

Game.forever(function() {
    Game.print('點擊畫面', 100, 100, 'red', 60);
});

