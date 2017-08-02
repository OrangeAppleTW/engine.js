var check = Game.createSprite(["assets/uncheck.png","assets/check.png"]);
check.on("click", function(){
    Game.sound.play("assets/pop.wav");
    if(check.costumeId == 0)
        this.costumeId = 1;
    else
        this.costumeId = 0;
});