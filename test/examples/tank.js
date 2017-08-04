var player = Game.createSprite("assets/arrow.png");
var computer = Game.createSprite("assets/arrow_e.png");

player.moveTo(32, 360-32);
player.direction = 45;
computer.moveTo(480-32, 32);
computer.direction = 225;

var score = 0;

computer.forever(function(){
    this.toward(player);
    this.stepForward(0.5);
    if(this.x < 32)
        this.x = 32
    if(this.x > 480-32)
        this.x = 480-32
    if(this.y < 32)
        this.y = 32
    if(this.y > 360-32)
        this.y = 360-32
});

computer.when("touch", player, function(){
    player.destroy();
    Game.pen.fillColor = '#333333';
    Game.pen.size = 20;
    Game.pen.drawText('Score: ' + Math.floor(score/60), 32, 32);
    Game.stop();
});

player.forever(function(){
    var vals = Object.values(Game.key);
    for(var i = 0; i < vals.length; i++){
        if(vals[i]){
            var key = (Object.keys(Game.key))[i];
            if(key != "any" && key != "count"){
                if(key == "w"){
                    this.stepForward(3);
                }else if(key == "a"){
                    if(this.direction >= 6)
                        this.direction-=6;
                    else if(this.direction == 0)
                        this.direction = 354;
                    else
                        this.direction = 0;
                }else if(key == "d"){
                    if(this.direction <= 354)
                        this.direction+=6;
                    else
                        this.direction = 0;
                }
            }
        }
    }
    if(this.x < 32)
        this.x = 32;
    if(this.x > 480-32)
        this.x = 480-32;
    if(this.y < 32)
        this.y = 32;
    if(this.y > 360-32)
        this.y = 360-32;
    score++;
    Game.pen.fillColor = '#333333';
    Game.pen.size = 20;
    Game.pen.drawText('Score: ' + Math.floor(score/60), 32, 32);
});