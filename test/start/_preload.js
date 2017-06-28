var files = 0;
var loaded = 0;
var doneText = '';
Game.preload([
    "./images/robot.png",
    "./images/monster.png",
    "./images/map.png",
    "./images/tower-btn.png",
    "./images/tower.png",
    "./assets/bomb.mp3",
    "./assets/BonusCube.mp3",
    "./assets/hallelujah.mp3",
  	"./assets/johnCena.mp3",
  	"./assets/happy.mp3"
],function() {
    doneText = 'preload done!';
},function(a, b) { loaded = a; files = b;});

Game.forever(function() {
    Game.print('Files loaded: ' + loaded + '/' + files, 100, 200, 'red', 30);
    Game.print(doneText, 100, 250, 'red', 30);
});

Game.start();