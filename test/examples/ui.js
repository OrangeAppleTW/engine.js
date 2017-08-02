var button = Game.createSprite("assets/button.png");
var flip = Game.createSprite(["assets/flip_off.png", "assets/flip_on.png"]);
var input = Game.createSprite(["assets/input.png", "assets/input_a.png"]);

var gkey = Game.key;

input.x = 260;
input.y = 90;
input.val = "";
input.active = false;
button.x = 192;
button.y = 360-32;
flip.x = 352;
flip.y = 360-32;
flip.active = false;

input.when("click", function(){
    if(!input.active){
        input.active = true;
        input.costumeId = 1;
        input.scale = 1.1;
    }else{
        input.active = false;
        input.costumeId = 0;
        input.scale = 1;
    }
});

flip.when("click", function(){
    if(!flip.active){
        flip.active = true;
        flip.costumeId = 1;
    }else{
        flip.active = false;
        flip.costumeId = 0;
    }
});

button.when("click", function(){
    if(flip.active){
        if(input.val != "" && (input.val)[0] != " " && (input.val)[(input.val).length-1] != " "){
            alert("Your text is \" " + input.val + " \"");
        }else{
            alert("You need to enter some text");
        }
    }else{
        alert("You need to flip on the switch!");
    }
});

Game.when('keydown', function() {
    if(input.active){
        var vals = Object.values(gkey);
        for(var i = 0; i<vals.length; i++){
            if(vals[i]){
                var key = (Object.keys(gkey))[i];
                if(key != "any" && key != "count"){
                    if(key == "backspace"){
                        if((input.val).length > 0){
                            input.val = (input.val).slice(0 ,-1);
                        }
                    }else if(key == "enter"){
                        input.active = false;
                        input.costumeId = 0;
                        input.scale = 1;
                    }else if(key != "shift"){
                        input.val += key;
                    }
                }
            }
        }
    }
});

Game.forever(function(){
    Game.pen.fillColor = '#333333';
    Game.pen.size = 30;
    Game.pen.drawText(input.val, 40, 70);
});
