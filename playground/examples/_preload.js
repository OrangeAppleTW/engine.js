var completedCount = 0;
Game.preloadImages([
    "./images/map.png",
    "./images/tower-btn.png",
    "./images/tower.png"
],function() {
    console.log('image preload done');
},function(e) {
    completedCount = e.completedCount;
});

Game.preloadSounds([
    "./assets/sound.mp3",
    "./assets/laser1.wav",
    "./assets/happy.mp3"
],function() {
    console.log('sound preload done');
}, function(e) {
    completedCount = e.completedCount;
});

Game.forever(function() {
    Game.print('Files completed count: ' + completedCount, 100, 200, 'red', 30);
});

Game.start();