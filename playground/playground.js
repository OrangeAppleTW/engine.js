/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 26);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */,
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop('#fff');\n\nGame.set({\n    width: 640,\n    height: 480\n});\n\nvar stitch_1 = Game.createSprite({\n  \tx: 200,\n  \ty: 240,\n\tcostumes: [\n        \"./images/animate/0.gif\",\n        \"./images/animate/1.gif\",\n        \"./images/animate/2.gif\",\n        \"./images/animate/3.gif\",\n        \"./images/animate/4.gif\",\n        \"./images/animate/5.gif\",\n        \"./images/animate/6.gif\",\n        \"./images/animate/7.gif\",\n        \"./images/animate/8.gif\",\n        \"./images/animate/9.gif\",\n        \"./images/animate/10.gif\",\n        \"./images/animate/11.gif\",\n        \"./images/animate/12.gif\",\n        \"./images/animate/13.gif\",\n        \"./images/animate/14.gif\",\n        \"./images/animate/15.gif\",\n        \"./images/animate/16.gif\",\n        \"./images/animate/17.gif\"\n    ]\n});\n\nvar stitch_2 = Game.createSprite({\n  \tx: 400,\n  \ty: 240,\n\tcostumes: [\n        \"./images/animate/0.gif\",\n        \"./images/animate/1.gif\",\n        \"./images/animate/2.gif\",\n        \"./images/animate/3.gif\",\n        \"./images/animate/4.gif\",\n        \"./images/animate/5.gif\",\n        \"./images/animate/6.gif\",\n        \"./images/animate/7.gif\",\n        \"./images/animate/8.gif\",\n        \"./images/animate/9.gif\",\n        \"./images/animate/10.gif\",\n        \"./images/animate/11.gif\",\n        \"./images/animate/12.gif\",\n        \"./images/animate/13.gif\",\n        \"./images/animate/14.gif\",\n        \"./images/animate/15.gif\",\n        \"./images/animate/16.gif\",\n        \"./images/animate/17.gif\"\n    ]\n});\n\nfunction playAnimate () {\n    stitch_1.animate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 5, playAnimate);\n}\nplayAnimate();\n\nstitch_2.animate([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17], 5);\n\nGame.start();"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop('#000000');\n\nvar score = 0;\nvar life = 0;\n\nvar start = Game.createSprite({\n    x: 320,\n    y: 250,\n    costumes: \"/playground/images/flappy-bird/start-button.png\"\n});\n\nstart.on('click', function() {\n    startGame();\n    Game.broadcast('start');\n    this.hidden = true;\n});\n\nstart.on('listen','gameOver', function () {\n    this.hidden = false;\n});\n\nvar gameOver = Game.createSprite({\n    x: 320,\n    y: 310,\n    costumes: \"/playground/images/flappy-bird/gameover.png\"\n});\ngameOver.hidden = true;\n\ngameOver.on('listen','start', function () {\n    this.hidden = true;\n});\n\ngameOver.on('listen','gameOver', function () {\n    this.hidden = false;\n});\n\nvar flyswatter = Game.createSprite({\n    x: 100,\n    y: 100,\n    costumes: \"/playground/images/flyswatter.png\"\n});\nflyswatter.hidden = true;\n\nflyswatter.on('listen','start', function () {\n    this.hidden = false;\n});\n\nflyswatter.on('listen','gameOver', function () {\n    this.hidden = true;\n});\n\nvar flies = [];\n\nfunction startGame() {\n    score = 0;\n    life = 34;\n    var i = 10;\n    while(i--) {\n        var fly = Game.createSprite({\n            x: Math.random()*640,\n            y: Math.random()*640,\n            direction: Math.random()*360,\n            costumes: \"/playground/images/flappy-bird/bird.png\"\n        });\n\n        fly.layer = 1;\n\n        fly.clock = 0;\n\n        fly.move = function () {\n            this.clock++;\n            this.stepForward(6);\n            if(this.clock%10) this.direction += Math.random() * 60 - 30;\n\n            if(this.x > 640) this.x -= 640;\n            if(this.x < 0) this.x += 640;\n            if(this.y > 480) this.y -= 480;\n            if(this.y < 0) this.y += 480;\n        }\n\n        fly.kill = function () {\n            score += 1;\n            life += 1;\n            this.x = Math.random()*640;\n            this.y= Math.random()*640;\n        }\n\n        fly.on('listen', 'gameOver', function () {\n            this.destroy();\n        });\n\n        flies.push(fly);\n    }\n}\n\nGame.on('click', function() {\n    for(var i=0; i<flies.length; i++) {\n        if(flyswatter.touched(flies[i])) {\n            flies[i].kill();\n        }\n    }\n    life -= 4;\n});\n\nGame.forever(function() {\n    if(life < 0) life = 0;\n    Game.print('score: ' + score, 10, 10, 'red', 20);\n    Game.print('life: ' + Math.round(life), 10, 40,'red', 20);\n    flyswatter.x = Game.cursor.x;\n    flyswatter.y = Game.cursor.y;\n    flies.forEach(function(b) {b.move()});\n    if(life <= 0) Game.broadcast('gameOver');\n});\n\nGame.start();"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop(\"./images/flappy-bird/bg.jpg\",0,0,320);\n\nvar bird = Game.createSprite({\n    x: 160,\n    y: 240,\n    costumes: \"./images/flappy-bird/bird.png\"\n});\nvar upTube = Game.createSprite({\n    x: 320,\n    y: 0,\n    costumes: \"./images/flappy-bird/up-tube.png\"\n});\nvar downTube = Game.createSprite({\n    x: 320,\n    y: 440,\n    costumes: \"./images/flappy-bird/down-tube.png\"\n});\nvar ground = Game.createSprite({\n    x: 160,\n    y: 460,\n    costumes: \"./images/flappy-bird/ground.png\"\n});\nbird.speed = 1;\nbird.forever(function(){\n    bird.y += bird.speed;\n    bird.speed += 0.15;\n});\ndownTube.forever(function(){\n\tif(this.x<-30){\n        this.x = 330;\n    }\n    upTube.x = this.x = this.x-2;\n});\n\nbird.when(\"touch\", ground, Game.stop);\nbird.when(\"touch\", upTube, Game.stop);\nbird.on(\"touch\", downTube, Game.stop);\nGame.on(\"click\", function(){\n    Game.sound.play(\"./assets/laser1.wav\");\n    bird.speed = -4;\n});\n\n\nGame.on(\"keydown\",\"space\",function(){bgMusic.pause();})\n\nGame.set({\n    width: 320,\n    height: 480\n});\n\nGame.update( function(){\n    Game.print(Game.inspector.fps, 280, 20);\n});\n\nGame.preloadImages(\n    [\n        \"./images/flappy-bird/bird.png\",\n        \"./images/flappy-bird/up-tube.png\",\n        \"./images/flappy-bird/down-tube.png\",\n        \"./images/flappy-bird/ground.png\",\n        \"./images/flappy-bird/bg.jpg\"\n    ],\n    function(){\n        console.log(\"Preloading complete\");\n        Game.start();\n        var bgMusic = Game.sound.play(\"./assets/happy.mp3\");\n    }\n);\n\nGame.print(\"Loading....\", 100, 240);"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop(\"#000000\");\n\nGame.forever(function(){\n\n    var y = 80\n\n    Game.print('**滑鼠測試**', 30, y, 'white');\n    Game.print('cursor.x: ' + Game.cursor.x, 30, y+ 20, 'white');\n    Game.print('cursor.y: ' + Game.cursor.y, 30, y + 2*20, 'white');\n    Game.print('cursor.left: ' + Game.cursor.left, 30, y + 3*20, 'white');\n    Game.print('cursor.right: ' + Game.cursor.right, 30, y + 4*20, 'white');\n    Game.print('cursor.isDown: ' + Game.cursor.isDown, 30, y + 5*20, 'white');\n\n    Game.print('**鍵盤測試**', 30, y + 8*20, 'white');\n    Game.print('key.q: ' + Game.key.q, 30, y + 9*20, 'white');\n    Game.print('key.w: ' + Game.key.w, 30, y + 10*20, 'white');\n    Game.print('key.e: ' + Game.key.e, 30, y + 11*20, 'white');\n    Game.print('key.r: ' + Game.key.r, 30, y + 12*20, 'white');\n});\n\nGame.start();"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "var files = 0;\nvar loaded = 0;\nvar doneText = '';\nGame.preload([\n    \"./images/robot.png\",\n    \"./images/monster.png\",\n    \"./images/map.png\",\n    \"./images/tower-btn.png\",\n    \"./images/tower.png\",\n    \"./assets/bomb.mp3\",\n    \"./assets/BonusCube.mp3\",\n    \"./assets/hallelujah.mp3\",\n  \t\"./assets/johnCena.mp3\",\n  \t\"./assets/happy.mp3\"\n],function() {\n    doneText = 'preload done!';\n},function(a, b) { loaded = a; files = b;});\n\nGame.forever(function() {\n    Game.print('Files loaded: ' + loaded + '/' + files, 100, 200, 'red', 30);\n    Game.print(doneText, 100, 250, 'red', 30);\n});\n\nGame.start();"

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop(\"#ffffff\");\n\nGame.set({\n    width: 640,\n    height: 480\n});\n\nvar slime = Game.createSprite(\"images/slime.gif\");\nslime.x = 320;\nslime.y = 240;\n\nslime.when(\"click\",function(){\n  \tslime.scale*=0.5;\n});\n\nslime.when(\"hover\",function(){\n\tslime.scale+=0.1;\n});\n\nGame.start()"

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop(\"#ffffff\");\n\nvar monster = Game.createSprite(\"./images/monster.png\");\n\nGame.forever(function(){\n    monster.toward(Game.cursor); \n    Game.print(\"Degree: \"+monster.direction);\n});\nGame.start();"

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = "var bird = Game.createSprite({\n    x: 160,\n    y: 240,\n    costumes: \"./images/flappy-bird/bird.png\"\n});\nvar bgPosition = {x:0, y:0};\n\nGame.on(\"holding\", \"right\", function(){\n    bgPosition.x -= 4;\n});\nGame.on(\"holding\", \"left\", function(){\n    bgPosition.x += 4;\n});\nGame.set({\n    width: 320,\n    height: 480\n});\n\nGame.update( function(){\n    Game.setBackdrop(\"./images/scrolling/bg.jpg\",bgPosition.x,bgPosition.y)\n});\n\nGame.preloadImages(\n    [\n        \"./images/flappy-bird/bird.png\",\n        \"./images/scrolling/bg.jpg\"\n    ],\n    function(){\n        Game.start();\n    }\n);\n\nGame.print(\"Loading....\", 100, 240);"

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = "Game.preload([\n    \"./assets/hallelujah.mp3\",\n    \"./assets/laser1.wav\",\n    \"./assets/bomb.mp3\",\n    \"./assets/johnCena.mp3\",\n    \"./assets/BonusCube.mp3\"\n],function() {\n    console.log('done!');\n    init();\n}, function(i) {\n    console.log('completed: ' + i);\n});\n\nfunction init () {\n    var btn_1 = Game.createSprite({\n        x:108, y:148,\n        costumes:\"./images/tower-btn.png\"\n    });\n    var btn_2 = Game.createSprite({\n        x:208, y:198,\n        costumes:\"./images/tower-btn.png\"\n    });\n    var btn_3 = Game.createSprite({\n        x:308, y:248,\n        costumes:\"./images/tower-btn.png\"\n    });\n    var btn_4 = Game.createSprite({\n        x:408, y:298,\n        costumes:\"./images/tower-btn.png\"\n    });\n    var btn_5 = Game.createSprite({\n        x:508, y:348,\n        costumes:\"./images/tower-btn.png\"\n    });\n    var btn_6 = Game.createSprite({\n        x:508, y:148,\n        costumes:\"./images/tower-btn.png\"\n    });\n\n    btn_1.sound = \"./assets/hallelujah.mp3\";\n    btn_2.sound = \"./assets/laser1.wav\";\n    btn_3.sound = \"./assets/bomb.mp3\";\n    btn_4.sound = \"./assets/johnCena.mp3\";\n    btn_5.sound = \"./assets/BonusCube.mp3\";\n\n    btn_1.when('click', playSound);\n    btn_2.when('click', playSound);\n    btn_3.when('click', playSound);\n    btn_4.when('click', playSound);\n    btn_5.when('click', playSound);\n    btn_6.when('click', function() {Game.sound.stop()});\n\n    function playSound () {\n        Game.sound.play(this.sound);\n    }\n}\n\nGame.start();"

/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports = "var clock = 0;\nvar stars = []\n\nGame.set({\n    width: 640,\n    height: 480\n});\nGame.drawBackdrop(\"#000000\");\n\nfor(let i=0; i<100; i++){\n    var newStar = Game.createSprite({\n    \tx: Math.random()*640,\n      \ty: Math.random()*480,\n        scale: 0.8 + Math.random()*0.4,\n      \tcostumes: \"./images/slime.gif\"\n    });\n    newStar.on(\"click\",function(){\n        this.destroy();\n    });\n  \tstars.push(newStar);\n}\n\nGame.forever(function(){\n    if(clock%30===0){\n        for(let i=0; i<stars.length; i++){\n            var star = stars[i];\n            if(Math.random()>0.2){\n                star.hidden=true;\n            } else {\n                star.hidden=false;\n            }\n        }\n    }\n    clock++;\n});\n\n// 測試空陣列能否正常執行\nGame.preloadImages([],function(){alert(\"Start!\");})\n\nGame.start();"

/***/ }),
/* 23 */
/***/ (function(module, exports) {

module.exports = "var ctx = Game.ctx;\nGame.setBackdrop(\"./images/map.png\")\n\nvar clock = 0,\n    hp = 100,\n    score = 0,\n    isBuilding = false;\nvar enemyPath = [\n    {x:96+16, y:64},\n    {x:384+32, y:64+16},\n    {x:384+16, y:192+32},\n    {x:224, y:192+16},\n    {x:224+16, y:320+32},\n    {x:544+32, y:320+16},\n    {x:544+16, y:96}\n];\n\nvar enemies = [];\nvar towers = [];\nvar towerButton = Game.createSprite({\n    x:608, y:448,\n    costumes:\"./images/tower-btn.png\"\n});\nvar towerTemplate = Game.createSprite({\n    x:0, y:0,\n    costumes: \"./images/tower.png\",\n    hidden: true,\n    layer: 999\n});\n\nGame.set({\n    width: 640,\n    height: 480\n});\n\nGame.on(\"click\", null, function(){\n    if(isBuilding){\n        if(!towerButton.touched(Game.cursor.x,Game.cursor.y)){\n            isBuilding = !isBuilding;\n            towerTemplate.hidden = !isBuilding;\n            buildTower()\n        }\n    }\n});\n\ntowerButton.on(\"click\", function(){\n    isBuilding = !isBuilding;\n    towerTemplate.hidden = !isBuilding;\n});\n\nGame.on(\"keydown\", \"s\", function(){\n    score += 100;\n});\n\nGame.update( function(){\n    if(clock%30===0){\n        spawnEnemy();\n    }\n    towerTemplate.moveTo(Game.cursor.x, Game.cursor.y);\n    Game.print(\"HP: \"+hp, 20, 40, \"white\", 20);\n    Game.print(\"Score: \"+score, 20, 60, \"white\", 20);\n    Game.print(\"FPS: \"+Game.inspector.fps, 20, 80, \"red\", 20);\n    if (hp<=0) {\n        Game.print(\"You lose!\", 200, 200, \"white\", 60);\n    }\n    clock++;\n});\n\nfunction buildTower() {\n    var newTower = Game.createSprite({\n        x: Game.cursor.x,\n        y: Game.cursor.y,\n        costumes:\"./images/tower.png\"\n    });\n    newTower.range = 96;\n    newTower.searchEnemy = function(){\n        for(let i=0; i<enemies.length; i++){\n            var distance = this.distanceTo(enemies[i]);\n            if (distance<=this.range) {\n                this.shoot(enemies[i]);\n                enemies.splice(i,1);\n                return;\n            }\n        }\n    };\n    newTower.shoot = function(enemy){\n        ctx.beginPath();\n        ctx.moveTo(this.x,this.y-16);\n        ctx.lineTo(enemy.x+16,enemy.y+16);\n        ctx.strokeStyle = 'red';\n        ctx.lineWidth = 3;\n        ctx.stroke();\n        enemy.hp -= 10;\n    };\n    newTower.always(function(){\n        if(clock%30<=0){\n            this.searchEnemy();\n        }\n    });\n    towers.push(newTower);\n}\n\nfunction spawnEnemy(){\n    var newEnemy = Game.createSprite({\n        x: 112,\n        y: 480,\n        rotationstyle: \"fixed\",\n        costumes:\"./images/slime.gif\"\n    });\n    newEnemy.pathIndex = 0;\n    newEnemy.hp = 10;\n    newEnemy.always(function(){\n        if(this.hp<=0){\n            this.destroy();\n            score += 10;\n        } else {\n            var destination = {\n                x:enemyPath[this.pathIndex].x,\n                y:enemyPath[this.pathIndex].y\n            }\n            this.toward(destination.x, destination.y);\n            this.stepForward(3);\n            if( this.touched(destination.x, destination.y) ){\n                this.pathIndex++;\n                if(this.pathIndex>=enemyPath.length){\n                    this.destroy();\n                    hp-=10;\n                }\n            }\n        }\n    });\n    enemies.push(newEnemy);\n}\n\nGame.start();"

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop(\"#ffffff\");\n\nvar robot = Game.createSprite({\n  \tscale: 0.3,\n  \tx: 400,\n  \ty: 300,\n\tcostumes: \"images/robot.png\"\n});\n\nvar monsters = [];\nfor(var i=0; i<20; i++){\n\tvar monster = Game.createSprite({\n        scale: 0.2,\n        x: Math.random()*640,\n        y: Math.random()*480,\n        costumes: \"images/monster.png\"\n    });\n\tmonsters.push(monster);\n}\n\nrobot.forever(function(){\n    this.x = Game.cursor.x;\n    this.y = Game.cursor.y;\n});\n\nvar attack = function(target){\n    this.scale += 0.05;\n  \ttarget.destroy();\n};\n\nrobot.when(\"touch\", monsters, attack);\n\nGame.start();"

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = "Game.setBackdrop(\"#ffffff\");\n\nvar monster = Game.createSprite({\n  x: 300,\n  y: 240,\n  scale: .5,\n  costumes: [\"./images/monster.png\"]\n});\nvar scale = .5;\nvar add = 0.001;\nGame.forever(function(){\n  if(scale < 0.1 || scale >.6) add = -add;\n  monster.direction += 1;\n  Game.set({zoom: (scale += add )})\n});\nmonster.on('hover', function() {\n\tGame.print('mouse hover', 10, 10, 'red', 50);\n})\nGame.start();"

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

window.Game = {};
var tdScript = __webpack_require__(23),
    flappyBirdScript = __webpack_require__(15),
    starsScript = __webpack_require__(22),
    scrollingScript = __webpack_require__(20),
    touchTestScript = __webpack_require__(24),
    pumpScript = __webpack_require__(18),
    rotationScript = __webpack_require__(19),
    animateScript = __webpack_require__(13),
    zoomScript = __webpack_require__(25),
    ioScript = __webpack_require__(16);
    broadcastScript = __webpack_require__(14);
    soundScript = __webpack_require__(21);
    preloadScript = __webpack_require__(17);

$("textarea#TD").val(tdScript);
$("textarea#flappy-bird").val(flappyBirdScript);
$("textarea#stars").val(starsScript);
$("textarea#scrolling").val(scrollingScript);
$("textarea#touch-test").val(touchTestScript);
$("textarea#pump").val(pumpScript);
$("textarea#rotation").val(rotationScript);
$("textarea#animate").val(animateScript);
$("textarea#zoom").val(zoomScript);
$("textarea#io").val(ioScript);
$("textarea#broadcast").val(broadcastScript);
$("textarea#sound").val(soundScript);
$("textarea#preload").val(preloadScript);

var editor = CodeMirror.fromTextArea(document.getElementById("script-box"), {
    lineNumbers: true,
    mode:  "javascript",
    theme: "mbo",
    styleActiveLine: true,
    matchBrackets: true
});
$("#run-code-button").click(
    function(){
        if(Game.stop){Game.stop();}
        Game = Engine("stage",true)
        editor.save();
        eval.call(window,document.getElementById("script-box").value);
        arrangeLayout();
    }
)
$("#stop-code-button").click(
    function(){
        $(this).hide();
        $("#start-code-button").show()
        Game.stop();
    }
);
$("#start-code-button").click(
    function(){
        $(this).hide();
        $("#stop-code-button").show()
        Game.start();
    }
);
$("#demo-selector a").click(function(){
    setTimeout(function(){
        putDemoCode();
    },0);
});
$(window).resize(function(){
     arrangeLayout();
});
arrangeLayout();
putDemoCode();

function arrangeLayout(){
    editor.setSize("100%", 540);
    var rightPartWidth = $(".container-fluid").width() - $(".left-part").outerWidth();
    $(".right-part").width(rightPartWidth);
}

function putDemoCode(){
    var hash = window.location.hash;
    if(hash==""||hash=="#"){
        editor.getDoc().setValue("");
    } else {
        editor.getDoc().setValue( $("textarea"+hash).val() );
    }
    // $('ul'+hash+':first').show();
}

/***/ })
/******/ ]);