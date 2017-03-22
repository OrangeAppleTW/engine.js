/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
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
/* 12 */
/***/ (function(module, exports) {

module.exports = "var bird = Game.createSprite({\n    x: 160,\n    y: 240,\n    costumes: \"./images/flappy-bird/bird.png\"\n});\nvar upTube = Game.createSprite({\n    x: 320,\n    y: 0,\n    costumes: \"./images/flappy-bird/up-tube.png\"\n});\nvar downTube = Game.createSprite({\n    x: 320,\n    y: 440,\n    costumes: \"./images/flappy-bird/down-tube.png\"\n});\nvar ground = Game.createSprite({\n    x: 160,\n    y: 460,\n    costumes: \"./images/flappy-bird/ground.png\"\n});\nbird.speed = 1;\nbird.forever(function(){\n    bird.y += bird.speed;\n    bird.speed += 0.15;\n});\ndownTube.forever(function(){\n\tif(this.x<-30){\n        this.x = 330;\n    }\n    upTube.x = this.x = this.x-2;\n});\n\nbird.when(\"touch\", ground, Game.stop);\nGame.when(\"touch\", [bird, upTube], Game.stop);\nGame.on(\"touch\", [bird, downTube], Game.stop);\nGame.on(\"click\", function(){\n    Game.sound.play(\"./assets/laser1.wav\");\n    bird.speed = -4;\n});\n\n\nGame.on(\"keydown\",\"space\",function(){bgMusic.pause();})\n\nGame.set({\n    width: 320,\n    height: 480\n});\n\nGame.update( function(){\n    Game.drawBackdrop(\"./images/flappy-bird/bg.jpg\",0,0,320);\n    Game.drawSprites();\n    Game.print(Game.inspector.fps, 280, 20);\n});\n\nGame.preloadImages(\n    [\n        \"./images/flappy-bird/bird.png\",\n        \"./images/flappy-bird/up-tube.png\",\n        \"./images/flappy-bird/down-tube.png\",\n        \"./images/flappy-bird/ground.png\",\n        \"./images/flappy-bird/bg.jpg\"\n    ],\n    function(){\n        console.log(\"Preloading complete\");\n        Game.start();\n        var bgMusic = Game.sound.play(\"./assets/happy.mp3\");\n    }\n);\n\nGame.print(\"Loading....\", 100, 240);"

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = "Game.set({\n    width: 640,\n    height: 480\n});\n\nvar slime = Game.createSprite(\"images/slime.gif\");\nslime.x = 320;\nslime.y = 240;\n\nslime.when(\"hover\",function(){\n\tslime.scale+=0.1;\n});\n\n// 可以使用 always\nGame.always(function(){\n    Game.drawBackdrop(\"#ffffff\");\n})\n// 或是 forever 來運行重複迴圈\nGame.forever(function(){\n\tGame.drawSprites();\n})\n\nGame.start()"

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "var bird = Game.createSprite({\n    x: 160,\n    y: 240,\n    costumes: \"./images/flappy-bird/bird.png\"\n});\nvar bgPosition = {x:0, y:0};\n\nGame.on(\"holding\", \"right\", function(){\n    bgPosition.x -= 4;\n});\nGame.on(\"holding\", \"left\", function(){\n    bgPosition.x += 4;\n});\nGame.set({\n    width: 320,\n    height: 480\n});\n\nGame.update( function(){\n    Game.drawBackdrop(\"./images/scrolling/bg.jpg\",bgPosition.x,bgPosition.y)\n    Game.drawSprites();\n});\n\nGame.preloadImages(\n    [\n        \"./images/flappy-bird/bird.png\",\n        \"./images/scrolling/bg.jpg\"\n    ],\n    function(){\n        Game.start();\n    }\n);\n\nGame.print(\"Loading....\", 100, 240);"

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "var clock = 0;\nvar stars = []\n\nGame.set({\n    width: 640,\n    height: 480\n});\n\nfor(let i=0; i<100; i++){\n    var newStar = Game.createSprite({\n    \tx: Math.random()*640,\n      \ty: Math.random()*480,\n        scale: 0.8 + Math.random()*0.4,\n      \tcostumes: \"./images/slime.gif\"\n    });\n    newStar.on(\"click\",function(){\n        this.destroy();\n    });\n  \tstars.push(newStar);\n}\n\nGame.update(function(){\n  \tGame.drawBackdrop(\"#000000\");\n});\n\nGame.forever(function(){\n    if(clock%30===0){\n        for(let i=0; i<stars.length; i++){\n            var star = stars[i];\n            if(Math.random()>0.2){\n                star.hidden=true;\n            } else {\n                star.hidden=false;\n            }\n        }\n    }\n    clock++;\n  \tGame.drawSprites();\n});\n\n// 測試空陣列能否正常執行\nGame.preloadImages([],function(){alert(\"Start!\");})\n\nGame.start();"

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "var ctx = Game.ctx;\n\nvar clock = 0,\n    hp = 100,\n    score = 0,\n    isBuilding = false;\nvar enemyPath = [\n    {x:96+16, y:64},\n    {x:384+32, y:64+16},\n    {x:384+16, y:192+32},\n    {x:224, y:192+16},\n    {x:224+16, y:320+32},\n    {x:544+32, y:320+16},\n    {x:544+16, y:96}\n];\n\nvar enemies = [];\nvar towers = [];\nvar towerButton = Game.createSprite({\n    x:608, y:448,\n    costumes:\"./images/tower-btn.png\"\n});\nvar towerTemplate = Game.createSprite({\n    x:0, y:0,\n    costumes: \"./images/tower.png\",\n    hidden: true\n});\n\nGame.set({\n    width: 640,\n    height: 480\n});\n\nGame.on(\"click\", null, function(){\n    if(isBuilding){\n        if(!towerButton.touched(Game.cursor.x,Game.cursor.y)){\n            isBuilding = !isBuilding;\n            towerTemplate.hidden = !isBuilding;\n            buildTower()\n        }\n    }\n});\n\ntowerButton.on(\"click\", function(){\n    isBuilding = !isBuilding;\n    towerTemplate.hidden = !isBuilding;\n});\n\nGame.on(\"keydown\", \"s\", function(){\n    score += 100;\n});\n\nGame.update( function(){\n    Game.drawBackdrop(\"./images/map.png\")\n    Game.drawSprites();\n    if(clock%30===0){\n        spawnEnemy();\n    }\n    towerTemplate.moveTo(Game.cursor.x, Game.cursor.y);\n    Game.print(\"HP: \"+hp, 20, 40, \"white\", 20);\n    Game.print(\"Score: \"+score, 20, 60, \"white\", 20);\n    Game.print(\"FPS: \"+Game.inspector.fps, 20, 80, \"red\", 20);\n    clock++;\n});\n\nfunction buildTower() {\n    var newTower = Game.createSprite({\n        x: Game.cursor.x,\n        y: Game.cursor.y,\n        costumes:\"./images/tower.png\"\n    });\n    newTower.range = 96;\n    newTower.searchEnemy = function(){\n        for(let i=0; i<enemies.length; i++){\n            var distance = this.distanceTo(enemies[i]);\n            if (distance<=this.range) {\n                this.shoot(enemies[i]);\n                enemies.splice(i,1);\n                return;\n            }\n        }\n    };\n    newTower.shoot = function(enemy){\n        ctx.beginPath();\n        ctx.moveTo(this.x,this.y-16);\n        ctx.lineTo(enemy.x+16,enemy.y+16);\n        ctx.strokeStyle = 'red';\n        ctx.lineWidth = 3;\n        ctx.stroke();\n        enemy.hp -= 10;\n    };\n    newTower.always(function(){\n        if(clock%30<=0){\n            this.searchEnemy();\n        }\n    });\n    towers.push(newTower);\n}\n\nfunction spawnEnemy(){\n    var newEnemy = Game.createSprite({\n        x: 112,\n        y: 480,\n        costumes:\"./images/slime.gif\"\n    });\n    newEnemy.pathIndex = 0;\n    newEnemy.hp = 10;\n    newEnemy.always(function(){\n        if(this.hp<=0){\n            this.destroy();\n            score += 10;\n        } else {\n            var destination = {\n                x:enemyPath[this.pathIndex].x,\n                y:enemyPath[this.pathIndex].y\n            }\n            this.toward(destination.x, destination.y);\n            this.stepForward(3);\n            if( this.touched(destination.x, destination.y) ){\n                this.pathIndex++;\n                if(this.pathIndex>=enemyPath.length){\n                    this.destroy();\n                    hp-=10;\n                }\n            }\n        }\n    });\n    enemies.push(newEnemy);\n}\n\nGame.start();"

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = "Game.set({\n    width: 640,\n    height: 480\n});\n\nvar robot = Game.createSprite({\n  \tscale: 0.3,\n  \tx: 400,\n  \ty: 300,\n\tcostumes: \"images/robot.png\"\n});\n\nvar monster = Game.createSprite({\n  \tscale: 0.4,\n  \tx: 80,\n  \ty: 300,\n\tcostumes: \"images/monster.png\"\n});\nmonster.hp=100;\n\nmonster.forever(function(){\n    this.x = Game.cursor.x;\n    this.y = Game.cursor.y;\n});\n\nvar attack = function(){\n  \t// 碰撞時執行的function會在 object 的 scope\n    console.log(this);\n  \tmonster.hp -= 50;\n};\n\nrobot.when(\"touch\", monster, attack);\n\nGame.forever(function(){\n\tGame.drawBackdrop(\"#ffffff\");\n  \tGame.drawSprites();\n});\n\nGame.start();"

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

window.Game = {};
var tdScript = __webpack_require__(16),
    flappyBirdScript = __webpack_require__(12),
    starsScript = __webpack_require__(15),
    scrollingScript = __webpack_require__(14),
    touchTestScript = __webpack_require__(17),
    pumpScript = __webpack_require__(13);

$("textarea#TD").val(tdScript);
$("textarea#flappy-bird").val(flappyBirdScript);
$("textarea#stars").val(starsScript);
$("textarea#scrolling").val(scrollingScript);
$("textarea#touch-test").val(touchTestScript);
$("textarea#pump").val(pumpScript);

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
        eval(document.getElementById("script-box").value);
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