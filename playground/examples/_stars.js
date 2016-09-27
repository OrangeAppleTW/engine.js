var clock = 0;

Game.set({
    width: 640,
    height: 480
});

Game.sprites.stars = [];

for(let i=0; i<100; i++){
    var newStar = Game.createSprite({
    	x: Math.random()*640,
      	y: Math.random()*480,
        scale: 0.8 + Math.random()*0.4,
      	costumes: "./images/slime.gif"
    });
    newStar.on("click",function(){
        this.destroy();
    });
  	Game.sprites.stars.push(newStar);
}

Game.update(function(){
  	Game.drawBackdrop("#000000");
    if(clock%30===0){
        for(let i=0; i<Game.sprites.stars.length; i++){
            var star = Game.sprites.stars[i];
            if(Math.random()>0.2){
                star.hidden=true;
            } else {
                star.hidden=false;
            }
        }
    }
    clock++;
  	Game.drawSprites();
});

Game.start();