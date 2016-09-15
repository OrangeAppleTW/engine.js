var clock = 0;
Game.sprites.stars = [];
for(let i=0; i<100; i++){
    var newStar = Game.createSprite({
    	  x: Math.random()*640,
      	y: Math.random()*480,
      	costumes: "./images/slime.gif"
    });
  	Game.sprites.stars.push(newStar);
}

function frameFunc() {
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
}
Game.setFrameFunc(frameFunc);
Game.start();