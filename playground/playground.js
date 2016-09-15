/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = Engine("stage");
	var tdScript = __webpack_require__(8),
	    flappyBirdScript = __webpack_require__(10),
	    starsScript = __webpack_require__(9);

	$("textarea#TD").val(tdScript);
	$("textarea#flappy-bird").val(flappyBirdScript);
	$("textarea#stars").val(starsScript);

	var editor = CodeMirror.fromTextArea(document.getElementById("script-box"), {
	    lineNumbers: true,
	    mode:  "javascript",
	    theme: "mbo",
	    styleActiveLine: true,
	    matchBrackets: true
	});
	document.getElementById("run-code-button").addEventListener(
	    "click", function(){
	        Game.stop();
	        editor.save();
	        eval(document.getElementById("script-box").value);
	        Game.start();
	    }
	)
	document.getElementById("stop-code-button").addEventListener(
	    "click", function(){
	        Game.stop();
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

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports) {

	module.exports = "var ctx = Game.ctx;\n\nvar clock = 0,\nhp = 100,\nscore = 0,\nisBuilding = false;\nvar enemyPath = [\n{x:96+16, y:64},\n{x:384+32, y:64+16},\n{x:384+16, y:192+32},\n{x:224, y:192+16},\n{x:224+16, y:320+32},\n{x:544+32, y:320+16},\n{x:544+16, y:96}\n];\n\nvar enemies = Game.sprites.enemies=[];\nvar towers = Game.sprites.towers=[];\nvar towerButton = Game.sprites.towerButton = Game.createSprite({\nx:608, y:448,\ncostumes:\"./images/tower-btn.png\"\n});\nvar towerTemplate = Game.sprites.towerTemplate = Game.createSprite({\nx:0, y:0,\ncostumes: \"./images/tower.png\",\nhidden: true\n});\n\nGame.on(\"click\", null, function(){\nif(isBuilding){\n    if(!towerButton.isCollidedTo(Game.cursor.x,Game.cursor.y)){\n        isBuilding = !isBuilding;\n        towerTemplate.hidden = !isBuilding;\n        buildTower()\n    }\n}\n});\n\nGame.on(\"click\", towerButton, function(){\nisBuilding = !isBuilding;\ntowerTemplate.hidden = !isBuilding;\n});\n\nGame.on(\"keydown\", \"s\", function(){\nscore += 100;\n});\n\nfunction frameFunc(){\n    Game.drawBackdrop(\"./images/map.png\")\n    Game.drawSprites();\n    if(clock%30===0){\n        var newEnemy = Game.createSprite({\n            x: 112,\n            y: 480,\n            costumes:\"./images/slime.gif\"\n        });\n        newEnemy.pathIndex = 0;\n        newEnemy.hp = 10;\n        enemies.push(newEnemy);\n    }\n    for(let i=0; i<enemies.length; i++){\n        var enemy = enemies[i]\n        if(enemy.hp<=0){\n            enemies.splice(i,1);\n            score += 10;\n        } else {\n            var destination = {\n                x:enemyPath[enemy.pathIndex].x,\n                y:enemyPath[enemy.pathIndex].y\n            }\n            enemy.toward(destination.x, destination.y);\n            enemy.stepForward(3);\n            if( enemy.isCollidedTo(destination.x, destination.y) ){\n                enemy.pathIndex++;\n                if(enemy.pathIndex>=enemyPath.length){\n                    enemies.splice(i,1);\n                    hp-=10;\n                }\n            }\n        }\n    }\n    for(let i=0; i<towers.length; i++){\n        if(clock%30<=0){\n            towers[i].searchEnemy();\n        }\n    }\n    towerTemplate.moveTo(Game.cursor.x, Game.cursor.y);\n    Game.print(\"HP: \"+hp, 20, 40, \"white\", 20);\n    Game.print(\"Score: \"+score, 20, 60, \"white\", 20);\n    Game.print(\"FPS: \"+Game.inspector.fps, 20, 80, \"red\", 20);\n    clock++;\n}\n\nfunction buildTower() {\nvar newTower = Game.createSprite({\n    x: Game.cursor.x,\n    y: Game.cursor.y,\n    costumes:\"./images/tower.png\"\n});\nnewTower.range = 96;\nnewTower.searchEnemy = function(){\n    for(let i=0; i<enemies.length; i++){\n        var distance = this.distanceTo(enemies[i]);\n        if (distance<=this.range) {\n            this.shoot(enemies[i]);\n            return;\n        }\n    }\n};\nnewTower.shoot = function(enemy){\n    ctx.beginPath();\n    ctx.moveTo(this.x,this.y-16);\n    ctx.lineTo(enemy.x+16,enemy.y+16);\n    ctx.strokeStyle = 'red';\n    ctx.lineWidth = 3;\n    ctx.stroke();\n    enemy.hp -= 10;\n};\ntowers.push(newTower);\n}\nGame.setFrameFunc(frameFunc);"

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "var clock = 0;\nGame.sprites.stars = [];\nfor(let i=0; i<100; i++){\n    var newStar = Game.createSprite({\n    \t  x: Math.random()*640,\n      \ty: Math.random()*480,\n      \tcostumes: \"./images/slime.gif\"\n    });\n  \tGame.sprites.stars.push(newStar);\n}\n\nfunction frameFunc() {\n  \tGame.drawBackdrop(\"#000000\");\n    if(clock%30===0){\n        for(let i=0; i<Game.sprites.stars.length; i++){\n            var star = Game.sprites.stars[i];\n            if(Math.random()>0.2){\n                star.hidden=true;\n            } else {\n                star.hidden=false;\n            }\n        }\n    }\n    clock++;\n  \tGame.drawSprites();\n}\nGame.setFrameFunc(frameFunc);\nGame.start();"

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "var bird = Game.sprites.bird = Game.createSprite({\n    x: 320,\n    y: 240,\n    costumes: \"./images/slime.gif\"\n});\nvar upTube = Game.sprites.upTube = Game.createSprite({\n    x: 640,\n    y: 0,\n    costumes: \"./images/up-tube.png\"\n});\nvar downTube = Game.sprites.downTube = Game.createSprite({\n    x: 640,\n    y: 440,\n    costumes: \"./images/down-tube.png\"\n});\nvar ground = Game.sprites.ground = Game.createSprite({\n    x: 320,\n    y: 460,\n    costumes: \"./images/ground.png\"\n});\nbird.speed = 1;\n\nGame.on(\"click\", null, function(){\n    bird.speed = -4;\n});\n\nfunction frameFunc() {\n    if(downTube.x<-30){\n        downTube.x = 670;\n    }\n    upTube.x = downTube.x = downTube.x-2;\n    bird.y += bird.speed;\n    bird.speed += 0.15;\n    Game.drawSprites();\n    if(bird.isCollidedTo(ground)){\n        Game.stop();\n    }\n}\n\nGame.setFrameFunc(frameFunc);\nGame.start();"

/***/ }
/******/ ]);