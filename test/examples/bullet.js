var gen_amout = 10;
var fruits = [];
var bullets = [];
var bullet_delay = 0;
var jet = Game.createSprite("assets/jet.png");
jet.y = 300;

var score = 0;

jet.forever(function(){
    if(Game.key["space"] && bullet_delay == 0){
        var bullet = Game.createSprite("assets/bullet.png");
        bullet.moveTo(this);
        bullet.forever(function(){
            this.y-=5;
            if(this.y < 64)
                this.destroy();
        });
        bullet.when('touch', fruits, function(){
            this.destroy();
        });
        bullets.push(bullet);
        bullet_delay = 10;
    }
    if(Game.key["a"] && this.x >32 ){
        this.x-=5;
    }
    if(Game.key["d"] && this.x <448 ){
        this.x+=5;
    }
    Game.pen.fillColor = '#333333';
    Game.pen.size = 20;
    Game.pen.drawText('Score: ' + score, 32, 32);
    if(bullet_delay > 0)
        bullet_delay--;
});

while(gen_amout--){
    var fruit = Game.createSprite("assets/fruit.png");
    fruit.moveTo(
        Math.floor(Math.random()*481),
        40
    );
    fruit.when("touch", bullets, function(){
        score++;
        this.destroy();
    });
  	fruits.push(fruit);
}