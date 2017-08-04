var gen_amout = 10;
var coins = [];
var koding = Game.createSprite("assets/koding.svg");
koding.scale = 0.25;
koding.follow = false;
koding.when("mousedown", function(){
    this.follow = true;
});
koding.when("mouseup", function(){
    this.follow = false;
});
koding.forever(function(){
    if(this.follow)
        this.moveTo(Game.cursor);
});
while(gen_amout--){
    var coin = Game.createSprite(["assets/coin1.png", "assets/coin2.png", "assets/coin3.png", "assets/coin4.png"]);
    coin.spin = 0;
    coin.forever(function(){
        if(this.spin == 10){
            if(this.costumeId!=3)
                this.costumeId++;
            else
                this.costumeId=0;
            this.spin = 0;
        }else this.spin++;
    });
    coin.when("touch", koding, function(){
        Game.sound.play("assets/coin.mp3");
        this.destroy();
    });
    coin.moveTo(
        Math.floor(Math.random()*481),
        Math.floor(Math.random()*361)
    );
    coins.push(coin);
}