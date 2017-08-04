var user = Game.createSprite(["assets/paper.png", "assets/sissor.png", "assets/stone.png"]);
var comp = Game.createSprite(["assets/paper.png", "assets/sissor.png", "assets/stone.png"]);

user.x = 64;
user.y = 360/2;

comp.x = 480 - 16;
comp.y = 360/2;

var key = Game.key;
var f = false;
var re = '';
Game.forever(function(){
    Game.pen.fillColor = '#333333';
    Game.pen.size = 60;
    Game.pen.drawText(re, 128, 128);
    if(key["1"]) 
        user.costumeId = 0;
    if(key["2"])
        user.costumeId = 1;
    if(key["3"])
        user.costumeId = 2;
    if(key["1"] || key["2"] || key["3"]){
        if(f){
            f = false;
            comp.costumeId = Math.floor(Math.random()*3);
            var u = user.costumeId/1 + 1;
            console.log(u);
            var c = comp.costumeId/1 + 1;
            console.log(c);
            if(u == c){
                re = "Tie!";
            }else if(u < c){
                if((c-u) == 1){
                    re = "Comp Win";
                }else{
                    re = "User Win";
                }
            }else if(c < u){
                if((u-c) == 1){
                    re = "User Win";
                }else{
                    re = "Comp Win";
                }
            }
        }
    }
    if(!(key["1"]) && !(key["2"]) && !(key["3"])){
        f = true;
    }
});