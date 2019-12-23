var bird = Game.createSprite(["./assets/bird_1.png", "./assets/bird_2.png", "./assets/bird_3.png"]);

setInterval(function() {
    bird.costumeId += 1;
    if(bird.costumeId >= 3) {
        bird.costumeId = 0;
    }
}, 300);