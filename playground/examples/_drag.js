var slime = Game.createSprite("./images/slime.gif");
slime.x=200;
slime.y=200;
slime.when("mousedown",function(){
    slime.dragged=true;
});
slime.forever(function(){
    if(this.dragged){
        this.x = Game.cursor.x;
        this.y = Game.cursor.y;
    }
});
Game.when("mouseup",function(){
    slime.dragged=false;
});
Game.start();