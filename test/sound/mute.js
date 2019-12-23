var player = Game.createSprite(['./assets/play.png','./assets/stop.png']);

Game.sound.play('./assets/bgm.ogg');
player.on('click', function() {
    if(this.costumeId == 0) {
        this.costumeId = 1;
        Game.sound.mute(true);
    } else {
        this.costumeId = 0;
        Game.sound.mute(false);
    }
});
