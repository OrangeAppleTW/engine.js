Game.when("click", function() {
    Game.sound.play("./assets/jump.ogg", true);
});

Game.forever(function() {
    Game.print("點擊畫面", 200, 170, "red", 30);
});