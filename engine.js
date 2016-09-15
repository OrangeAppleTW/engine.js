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

	/**
	 * Whether the environment is a WebWorker.
	 * @const{boolean}
	 */
	// var ENV_WORKER = typeof importScripts === 'function';

	function engine(stageId, frameFunc, stageWidth, stageHeight){
	    var Sprite = __webpack_require__(1);
	    var inspector = __webpack_require__(4);
	    var canvas= document.getElementById(stageId);
	    var ctx = canvas.getContext("2d");
	    var sprites = {};

	    stageWidth = stageWidth || canvas.width;
	    stageHeight = stageHeight || canvas.height;

	    var io = __webpack_require__(5)(canvas);
	    var eventList = __webpack_require__(3)(io);
	    var renderer = __webpack_require__(7)(ctx, stageWidth, stageHeight, frameFunc, sprites, eventList, inspector);

	    // @TODO: Stop 的時候clear sprites
	    function stop(){
	        eventList.clear();
	        renderer.stop();
	    }

	    // @TODO: Clear all sprites
	    var proxy = {
	        sprites: sprites,
	        createSprite: Sprite.new,
	        print: renderer.print,
	        drawSprites: renderer.drawSprites,
	        drawBackdrop: renderer.drawBackdrop,
	        cursor: io.cursor,
	        inspector: inspector,
	        on: eventList.register,
	        //@TODO: set ratio
	        //@TODO: set gravity
	        set: function(){},
	        stop: stop,
	        start: renderer.startRendering,
	        // @TODO: merge into set
	        setFrameFunc: renderer.setFrameFunc,
	        ctx: ctx
	    };
	    return proxy;
	}

	// if(ENV_WORKER){
	//     onmessage = function(e){
	//         var message = e.data[0],
	//             data = e.data[1];
	//         switch(message){
	//             case ""
	//         }
	//     }
	// }

	window.Engine = engine;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);

	// @TODO: 客製化特征
	function Sprite(args) {
	    this.x = args.x;
	    this.y = args.y;
	    this.direction = args.direction;
	    this.scale = args.scale;
	    this.costumes = [].concat(args.costumes); // Deal with single string
	    this.currentCostumeId = 0; // Deal with single string
	    this.deleted = args.scale;
	    this.width = 1;
	    this.height = 1;
	    this.hidden = args.hidden;
	}

	Sprite.new = function(args){
	    return new Sprite(args);
	};

	Sprite.prototype.moveTo = function(x, y){
	    this.x = x;
	    this.y = y;
	};

	Sprite.prototype.move = function(x, y){
	    this.x += x;
	    this.y += y;
	};

	Sprite.prototype.stepForward = function(distance){
	    var rad = util.degreeToRad(this.direction)
	    this.x += Math.cos(rad)*distance;
	    this.y -= Math.sin(rad)*distance;
	};

	Sprite.prototype.toward = function(){
	    var targetX, targetY, offsetX, offsetY, rad;
	    if(util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)){
	        targetX = arguments[0].x,
	        targetY = arguments[0].y;
	    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
	        targetX = arguments[0],
	        targetY = arguments[1];
	    } else {
	        throw "請傳入角色(Sprite)或是 X, Y 坐標值";
	    }
	    offsetX = targetX - this.x;
	    offsetY = targetY - this.y;
	    rad = Math.atan2(-offsetY, offsetX); // 這裡的 offsetY 和數學坐標是反過來的
	    this.direction = util.radToDegree(rad);
	    // console.log(this.direction);
	}

	// @TODO: rename => touched
	Sprite.prototype.isCollidedTo = function(){
	    var crossX = crossY = false;
	    if( arguments[0] instanceof Sprite ){
	        var target = arguments[0];
	        crossX = (this.x+this.width/2)>(target.x-target.width/2) && (target.x+target.width/2)>(this.x-this.width/2);
	        crossY = (this.y+this.height/2)>(target.y-target.height/2) && (target.y+target.height/2)>(this.y-this.height/2);
	    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
	        var targetX = arguments[0],
	            targetY = arguments[1];
	        crossX = (this.x+this.width/2)>targetX && targetX>(this.x-this.width/2);
	        crossY = (this.y+this.height/2)>targetY && targetY>(this.y-this.height/2);
	    } else {
	        throw "請傳入角色(Sprite)或是 X, Y 坐標值";
	    }
	    return (crossX && crossY);
	};

	Sprite.prototype.distanceTo = function(){
	    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
	        return util.distanceBetween( this, arguments[0] );
	    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
	        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
	    }
	}

	module.exports = Sprite;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var util = {};

	util.isNumeric = function(n){
	    return !isNaN(parseFloat(n)) && isFinite(n);
	}
	util.radToDegree = function(rad){
	    if(rad<0){rad += 2 * Math.PI;}
	    return rad*180/Math.PI;
	}
	util.degreeToRad = function(degree){
	    return degree/180*Math.PI
	}
	util.distanceBetween = function(){
	    var from = {x:0,y:0},
	        to   = {x:0,y:0};
	    if( util.isNumeric(arguments[0].x) &&
	        util.isNumeric(arguments[0].y) &&
	        util.isNumeric(arguments[1].x) &&
	        util.isNumeric(arguments[1].y)
	    ){
	        from.x = arguments[0].x;
	        from.y = arguments[0].y;
	        to.x = arguments[1].x;
	        to.y = arguments[1].y;
	    } else if (
	        util.isNumeric(arguments[0]) &&
	        util.isNumeric(arguments[1]) &&
	        util.isNumeric(arguments[2]) &&
	        util.isNumeric(arguments[3])
	    ) {
	        from.x = arguments[0];
	        from.y = arguments[1];
	        to.x   = arguments[2];
	        to.y   = arguments[3];
	    } else {
	        throw "請傳入角色(Sprite)或是 X, Y 坐標值";
	    }
	    return Math.sqrt( Math.pow(to.x-from.x,2) + Math.pow(to.y-from.y,2) )
	}

	module.exports = util;

/***/ },
/* 3 */
/***/ function(module, exports) {

	var pool=[],
	    io = {};

	function eventList(importIo){
	    var exports={};
	    io = importIo;

	    exports.register = function(event, target, handler){
	        var eventObj = {
	            event:event,
	            handler:handler
	        }
	        // @TODO: target 型別偵測
	        if (event=="keydown" || event=="keyup"){
	            eventObj.key = target;
	        } else {
	            eventObj.sprite = target;
	        }
	        pool.push(eventObj);
	    };
	    exports.traverse = function (){
	        for(let i=0; i<pool.length; i++){
	            if (pool[i].event=="hover") { hoverJudger( pool[i].sprite, pool[i].handler ); }
	            else if (pool[i].event=="click") { clickJudger( pool[i].sprite, pool[i].handler ); }
	            else if (pool[i].event=="keydown") { keydownJudger(pool[i].key, pool[i].handler); }
	            else if (pool[i].event=="keyup") {}
	        }
	        clearEventRecord();
	    }
	    exports.clear = function(){
	        pool=[];
	    }
	    return exports;
	}

	function hoverJudger(sprite, handler){
	    var crossX = (sprite.x+sprite.width/2)>io.cursor.x && io.cursor.x>(sprite.x-sprite.width/2),
	        crossY = (sprite.y+sprite.height/2)>io.cursor.y && io.cursor.y>(sprite.y-sprite.height/2);
	    if(crossX && crossY){
	        handler.call(sprite);
	    }
	}

	function clickJudger(sprite, handler){
	    if(io.clicked.x && io.clicked.y){ // 如果有點擊記錄才檢查
	        if(sprite){
	            // 如果是 Sprite, 則對其做判定
	            var crossX = (sprite.x+sprite.width/2)>io.clicked.x && io.clicked.x>(sprite.x-sprite.width/2),
	                crossY = (sprite.y+sprite.height/2)>io.clicked.y && io.clicked.y>(sprite.y-sprite.height/2);
	            if(crossX && crossY){
	                handler.call(sprite);
	            }
	        } else {
	            // 如果為 null, 則對整個遊戲舞台做判定
	            handler();
	        }
	    }
	}

	function keydownJudger(key, handler){
	    if(io.keydown[key]){
	        handler();
	    }
	}

	function clearEventRecord(){
	    io.clicked.x=null;
	    io.clicked.y=null;
	    for(let key in io.keydown){
	        io.keydown[key]=false;
	    }
	}

	module.exports = eventList;

/***/ },
/* 4 */
/***/ function(module, exports) {

	var inspector = {
	    fps:0,
	    lastFrameUpdatedTime:(new Date()).getTime(),
	    updateFPS: function(){
	        var now = (new Date()).getTime();
	        this.fps = Math.round( 1000/(now-this.lastFrameUpdatedTime) );
	        this.lastFrameUpdatedTime = now;
	    }
	};

	module.exports = inspector;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var keycode = __webpack_require__(6);
	var exports={},
	    cursor={x:0, y:0},
	    key=[],
	    clicked={x:null, y:null},
	    keyup={},
	    keydown={};

	var io = function(canvas){

	    // Make any element focusable for keydown event.
	    canvas.setAttribute("tabindex",'1');
	    canvas.style.outline = "none";

	    canvas.addEventListener("mousemove", function(e){
	        cursor.x = e.offsetX;
	        cursor.y = e.offsetY;
	    });

	    canvas.addEventListener("click", function(e){
	        clicked.x = e.offsetX;
	        clicked.y = e.offsetY;
	    });

	    canvas.addEventListener("keydown", function(e){
	        keydown[keycode(e.keyCode)] = true;
	    });

	    canvas.addEventListener("keyup", function(e){
	        keyup[keycode(e.keyCode)] = true;
	    });

	    exports.cursor = cursor;
	    exports.clicked = clicked;
	    exports.keyup = keyup;
	    exports.keydown = keydown;
	    return exports;
	};

	module.exports = io;

/***/ },
/* 6 */
/***/ function(module, exports) {

	// Source: http://jsfiddle.net/vWx8V/
	// http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

	/**
	 * Conenience method returns corresponding value for given keyName or keyCode.
	 *
	 * @param {Mixed} keyCode {Number} or keyName {String}
	 * @return {Mixed}
	 * @api public
	 */

	exports = module.exports = function(searchInput) {
	  // Keyboard Events
	  if (searchInput && 'object' === typeof searchInput) {
	    var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode
	    if (hasKeyCode) searchInput = hasKeyCode
	  }

	  // Numbers
	  if ('number' === typeof searchInput) return names[searchInput]

	  // Everything else (cast to string)
	  var search = String(searchInput)

	  // check codes
	  var foundNamedKey = codes[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // check aliases
	  var foundNamedKey = aliases[search.toLowerCase()]
	  if (foundNamedKey) return foundNamedKey

	  // weird character?
	  if (search.length === 1) return search.charCodeAt(0)

	  return undefined
	}

	/**
	 * Get by name
	 *
	 *   exports.code['enter'] // => 13
	 */

	var codes = exports.code = exports.codes = {
	  'backspace': 8,
	  'tab': 9,
	  'enter': 13,
	  'shift': 16,
	  'ctrl': 17,
	  'alt': 18,
	  'pause/break': 19,
	  'caps lock': 20,
	  'esc': 27,
	  'space': 32,
	  'page up': 33,
	  'page down': 34,
	  'end': 35,
	  'home': 36,
	  'left': 37,
	  'up': 38,
	  'right': 39,
	  'down': 40,
	  'insert': 45,
	  'delete': 46,
	  'command': 91,
	  'left command': 91,
	  'right command': 93,
	  'numpad *': 106,
	  'numpad +': 107,
	  'numpad -': 109,
	  'numpad .': 110,
	  'numpad /': 111,
	  'num lock': 144,
	  'scroll lock': 145,
	  'my computer': 182,
	  'my calculator': 183,
	  ';': 186,
	  '=': 187,
	  ',': 188,
	  '-': 189,
	  '.': 190,
	  '/': 191,
	  '`': 192,
	  '[': 219,
	  '\\': 220,
	  ']': 221,
	  "'": 222
	}

	// Helper aliases

	var aliases = exports.aliases = {
	  'windows': 91,
	  '⇧': 16,
	  '⌥': 18,
	  '⌃': 17,
	  '⌘': 91,
	  'ctl': 17,
	  'control': 17,
	  'option': 18,
	  'pause': 19,
	  'break': 19,
	  'caps': 20,
	  'return': 13,
	  'escape': 27,
	  'spc': 32,
	  'pgup': 33,
	  'pgdn': 34,
	  'ins': 45,
	  'del': 46,
	  'cmd': 91
	}


	/*!
	 * Programatically add the following
	 */

	// lower case chars
	for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32

	// numbers
	for (var i = 48; i < 58; i++) codes[i - 48] = i

	// function keys
	for (i = 1; i < 13; i++) codes['f'+i] = i + 111

	// numpad keys
	for (i = 0; i < 10; i++) codes['numpad '+i] = i + 96

	/**
	 * Get by code
	 *
	 *   exports.name[13] // => 'Enter'
	 */

	var names = exports.names = exports.title = {} // title for backward compat

	// Create reverse mapping
	for (i in codes) names[codes[i]] = i

	// Add aliases
	for (var alias in aliases) {
	  codes[alias] = aliases[alias]
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	//  state 用來表達 renderer 的以下狀態：
	//
	//   1. readyToStart:
	//      初始狀態，此時執行 startRendering 會直接開始 rendering，並將狀態切換為 "running"。
	//   2. running:
	//      不停 Rendering，此時可執行 stop 將狀態切換為 "stopping"。
	//      但是執行 startRendering 則不會有任何反應
	//      執行 stop 則不會有任何反應。
	//   3. stopping:
	//      此時雖然已接受到停止訊息，但是最後一次的 rendering 尚未結束，
	//      因此若在此時執行 startRendering，會每隔一小段時間檢查 state 是否回復到 "readyToStart"。
	//
	//  狀態變化流程如下：
	//  (1) -> (2) -> (3) -> (1)

	var FPS = 60,
	    costumesCache={},
	    backdropCache={},
	    state="readyToStart"; //"readyToStart", "stopping", "running";

	function Renderer(ctx, stageWidth, stageHeight, frameFunc, sprites, eventList, inspector){

	    var exports = {};

	    if(frameFunc){
	        startRendering(frameFunc);
	    }

	    function print(words, x, y, color, size, font) {
	        var size = size || 16; // Set or default
	        var font = font || "Arial";
	        ctx.font = size+"px " + font;
	        ctx.fillStyle = color || "black";
	        ctx.fillText(words,x,y);
	    }

	    function drawSprites(){
	        for(let key in sprites){
	            if (sprites[key].constructor.name === "Sprite") {
	                drawInstance(sprites[key]);
	            } else if (sprites[key] instanceof Array) {
	                var instances = sprites[key];
	                for(let i=0; i<instances.length; i++){
	                    var instance = instances[i];
	                    drawInstance(instance);
	                }
	            }
	        }
	        function drawInstance(instance){
	            if(!instance.hidden){
	                var id = instance.currentCostumeId;
	                var img = costumesCache[instance.costumes[id]];
	                // Solution A:
	                // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	                if( !img ){
	                    img=new Image();
	                    img.src=instance.costumes[id];
	                    costumesCache[instance.costumes[id]]=img;
	                }
	                instance.width = img.width;
	                instance.height = img.height;
	                // Solution B:
	                // var img = new Image();
	                // img.src=instance.costumes[0];
	                ctx.drawImage( img, instance.x-img.width/2, instance.y-img.height/2 );
	            }
	        }
	    }

	    // @TODO: 型別檢測
	    function drawBackdrop(src){
	        if(src[0]=='#'){
	            ctx.fillStyle=src;
	            ctx.fillRect(0,0,stageWidth,stageHeight);
	        } else {
	            var img = costumesCache[src];
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            if( !img ){
	                img=new Image();
	                img.src=src;
	                backdropCache[src]=img;
	            }
	            ctx.drawImage( img, 0, 0 )
	        }
	    }

	    function setFrameFunc(func) {
	        frameFunc = func;
	    }

	    function startRendering(){
	        if(state==="readyToStart"){
	            state = "running";
	            var draw = function(){
	                if(state==="running"){
	                    ctx.clearRect(0,0,stageWidth,stageHeight);

	                    frameFunc(); // 放在 clear 後面，才能讓使用者自行在 canvas 上畫東西

	                    eventList.traverse();

	                    inspector.updateFPS();
	                    setTimeout(function(){
	                        requestAnimationFrame(draw);
	                    },1000/FPS);
	                } else {
	                    state = "readyToStart";
	                }
	            }
	            setTimeout( draw, 0 ); // 必須 Async，否則會產生微妙的時間差
	        } else if (state==="stopping") {
	            setTimeout( startRendering, 10 );
	        }
	    }

	    function stop(){
	        if(state==="running"){
	            state = "stopping";
	        }
	    }

	    exports.print = print;
	    exports.drawSprites = drawSprites;
	    exports.drawBackdrop = drawBackdrop;
	    exports.startRendering = startRendering;
	    exports.stop = stop;
	    exports.setFrameFunc = setFrameFunc;

	    return exports;
	}

	module.exports = Renderer;

/***/ }
/******/ ]);