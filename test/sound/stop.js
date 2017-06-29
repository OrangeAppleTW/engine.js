var player = Game.createSprite(["./assets/play.png","./assets/stop.png"]);

player.when("click", function() {
    if(this.costumeId == 0) {
        this.costumeId = 1;
        Game.sound.play("./assets/bgm.ogg");
    } else {
        this.costumeId = 0;
        Game.sound.stop();
    }
});