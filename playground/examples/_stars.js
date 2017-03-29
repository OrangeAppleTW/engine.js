var clock = 0;
var stars = []

Game.set({
    width: 640,
    height: 480
});
Game.drawBackdrop("#000000");

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
  	stars.push(newStar);
}

Game.forever(function(){
    if(clock%30===0){
        for(let i=0; i<stars.length; i++){
            var star = stars[i];
            if(Math.random()>0.2){
                star.hidden=true;
            } else {
                star.hidden=false;
            }
        }
    }
    clock++;
});

// 測試空陣列能否正常執行
Game.preloadImages([],function(){alert("Start!");})

Game.start();