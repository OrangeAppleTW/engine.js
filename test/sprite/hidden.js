var gameOver = Game.createSprite({
    costumes: "./assets/gameOver.png",
    hidden: true
});

Game.when("click", function() {
    gameOver.hidden = false;
});

Game.forever(function() {
    print('點擊畫面', 100, 100, 'red', 30);
});

