var gen = false;
var gen_delay = 60;
var gen_i = 0;
var score = 0;
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
    Game.pen.fillColor = '#333333';
    Game.pen.size = 20;
    Game.pen.drawText('Score: '+score, 32, 32);
});
Game.forever(function(){
    if(gen){
        var coin = Game.createSprite(["assets/coin1.png", "assets/coin2.png", "assets/coin3.png", "assets/coin4.png"]);
        coin.spin = 0;
        coin.forever(function(){
            if(this.spin == 10){
                if(this.costumeId!=3)
                    this.costumeId++;
                else
                    this.costumeId=0;
                this.spin = 0;
            }else 
                this.spin++;
        });
        coin.when("touch", koding, function(){
            Game.sound.play("assets/coin.mp3");
            score++;
            this.destroy();
        });
        coin.moveTo(
            Math.floor(Math.random()*481),
            Math.floor(Math.random()*361)
        );
        gen = false;
    }else{
        gen_i++;
        if(gen_i == gen_delay){
            gen = true;
            gen_i = 0;
        }
    }
});