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

	var Sprite = __webpack_require__(1);
	var Sprites = __webpack_require__(3);
	var EventList = __webpack_require__(4);
	var Inspector = __webpack_require__(5);
	var Clock = __webpack_require__(6);
	var Renderer = __webpack_require__(7);
	var Sound = __webpack_require__(9);

	function engine(stageId, debugMode){

	    var canvas= document.getElementById(stageId);
	    var ctx = canvas.getContext("2d");

	    var settings = {
	        width: canvas.width,
	        height: canvas.height,
	        ratio: 1, //@TODO: set ratio
	        // gravity: 0, //@TODO: set gravity
	        update: function(){}
	    };

	    var sprites = new Sprites();
	    var inspector = new Inspector();
	    var io = __webpack_require__(10)(canvas, settings, debugMode);
	    var eventList = new EventList(io, debugMode);
	    var renderer = new Renderer(ctx, settings, debugMode);
	    var sound = new Sound();
	    var clock = new Clock(function(){
	        eventList.traverse();
	        settings.update();
	        sprites.runOnTick();
	        sprites.removeDeletedSprites();
	        inspector.updateFPS();
	    });

	    debugMode = debugMode || false;

	    function set(args){
	        settings.ratio      = args.ratio || settings.ratio;
	        settings.width      = args.width || settings.width;
	        settings.height     = args.height || settings.height;
	        settings.gravity    = args.gravity || settings.gravity;
	        settings.update     = args.update || settings.update;
	        if(args.width || args.ratio){ canvas.width = settings.width*settings.ratio;}
	        if(args.height || args.ratio){ canvas.height = settings.height*settings.ratio;}
	        return this;
	    }

	    // function reset(){
	    //     eventList.clear();
	    //     sprites.clear();
	    // }

	    var proxy = {
	        sprites: sprites,
	        createSprite: function(args){ return new Sprite(args, eventList, settings, renderer) }, // Pass io object into it because the sprite need to hear from events
	        print: renderer.print,
	        drawSprites: function(){ renderer.drawSprites(sprites); },
	        drawBackdrop: function(src, x, y, width, height){ renderer.drawBackdrop(src, x, y, width, height); },
	        cursor: io.cursor,
	        inspector: inspector,
	        on: function(event, target, handler){ eventList.register(event, target, handler) },
	        when: function(event, target, handler){ eventList.register(event, target, handler) },
	        set: set,
	        stop: function(){ clock.stop(); sound.stop(); },
	        start: function(){ clock.start(); },
	        update: function(func){ settings.update=func; },
	        ctx: ctx,
	        clear: function(){ renderer.clear(); },
	        preloadImages: function(imagePaths, completeCallback, progressCallback){ renderer.preload(imagePaths, completeCallback, progressCallback); },
	        sound: sound
	    };
	    return proxy;
	}

	window.Engine = engine;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var hitCanvas = document.createElement('canvas'),
	    hitTester = hitCanvas.getContext('2d');
	    document.body.appendChild(hitCanvas);

	// @TODO: 客製化特征
	function Sprite(args, eventList, settings, renderer) {
	    this.x = args.x;
	    this.y = args.y;
	    this.direction = args.direction || 0;
	    this.scale = args.scale || 1;
	    this.costumes = [].concat(args.costumes); // Deal with single string
	    this.currentCostumeId = 0;
	    this.width = 1;
	    this.height = 1;
	    this.hidden = args.hidden;

	    this._onTick = null;
	    this._deleted = false;

	    this._eventList = eventList;
	    this._settings = settings;
	    this._renderer = renderer;
	}

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

	Sprite.prototype.touched = function(){
	    // 由於效能考量，先用成本最小的「座標範圍演算法」判斷是否有機會「像素重疊」
	    var crossX = crossY = false;
	    if( arguments[0] instanceof Sprite ){
	        var target = arguments[0];
	        crossX = (this.x+this.width/2)>(target.x-target.width/2) && (target.x+target.width/2)>(this.x-this.width/2);
	        crossY = (this.y+this.height/2)>(target.y-target.height/2) && (target.y+target.height/2)>(this.y-this.height/2);
	    } else if ( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ) {
	        var targetX = arguments[0].x,
	            targetY = arguments[0].y;
	        crossX = (this.x+this.width/2)>targetX && targetX>(this.x-this.width/2);
	        crossY = (this.y+this.height/2)>targetY && targetY>(this.y-this.height/2);
	    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
	        var targetX = arguments[0],
	            targetY = arguments[1];
	        crossX = (this.x+this.width/2)>targetX && targetX>(this.x-this.width/2);
	        crossY = (this.y+this.height/2)>targetY && targetY>(this.y-this.height/2);
	    } else {
	        throw "請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";
	    }

	    // 如果經過「座標範圍演算法」判斷，兩者有機會重疊，則進一步使用「像素重疊演算法」進行判斷
	    if (crossX && crossY) {
	        var renderer = this._renderer;
	        var settings = this._settings;
	        hitCanvas.width = settings.width;
	        hitCanvas.height = settings.height;

	        hitTester.globalCompositeOperation = 'source-over';
	        hitTester.drawImage(    renderer.getImgFromCache(this.getCurrentCostume()),
	                                this.x-this.width/2, this.y-this.height/2,
	                                this.width, this.height );

	        hitTester.globalCompositeOperation = 'source-in';
	        if( arguments[0] instanceof Sprite ){
	            var target = arguments[0];
	            hitTester.drawImage(    renderer.getImgFromCache(target.getCurrentCostume()),
	                                    target.x-target.width/2, target.y-target.height/2,
	                                    target.width*target.scale, target.height*target.scale );
	        } else if ( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ) {
	            hitTester.fillRect(arguments[0].x,arguments[0].y,1,1);
	        } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
	            hitTester.fillRect(arguments[0],arguments[1],1,1);
	        } else {
	            return false
	        }

	        // 只要對 sprite 的大小範圍取樣即可，不需對整張 canvas 取樣
	        var aData = hitTester.getImageData(this.x-this.width/2, this.y-this.height/2, this.width, this.height).data;
	        var pxCount = aData.length;
	        for (var i = 0; i < pxCount; i += 4) {
	            if (aData[i+3] > 0) {
	                return true;
	            }
	        }
	    }
	    return false;
	};

	Sprite.prototype.distanceTo = function(){
	    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
	        return util.distanceBetween( this, arguments[0] );
	    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
	        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
	    }
	};

	Sprite.prototype.always = Sprite.prototype.forever = function(func){
	    this._onTick = func;
	};

	Sprite.prototype.when = Sprite.prototype.on = function(){
	    var event = arguments[0],
	        target, handler;
	    if(event=="hover" || event=="click"){
	        target = this;
	        handler = arguments[1];
	    } else if (event=="touch"){
	        if(Array.isArray(arguments[1])){
	            target = [this].concat(arguments[1]);
	        } else {
	            target = [this].concat([arguments[1]]);
	        }
	        handler = arguments[2];
	    } else {
	        console.log('Sprite.on() does only support "click", "hover" and "touch" events');
	        return false;
	    }
	    this._eventList.register(event, target, handler);
	};

	Sprite.prototype.destroy = function(){
	    this._deleted = true;
	};

	Sprite.prototype.getCurrentCostume = function(){
	    var id = this.currentCostumeId;
	    return this.costumes[id];
	};

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

	function Sprites(){}

	Sprites.prototype.runOnTick = function(){
	    this.each(function(){
	        if(this._onTick){ this._onTick(); }
	    });
	}

	Sprites.prototype.each = function(func){
	    for(var key in this){
	        if (this[key].constructor.name === "Sprite") {
	            func.call(this[key],this[key]);
	        } else if (this[key] instanceof Array) {
	            var instances = this[key];
	            for(var i=0; i<instances.length; i++){
	                var instance = instances[i];
	                func.call(instance,instance);
	            }
	        }
	    }
	}

	Sprites.prototype.removeDeletedSprites = function(){
	    for(var key in this){
	        if (this[key].constructor.name === "Sprite") {
	            if(this[key]._deleted){ delete this[key]; }
	        } else if (this[key] instanceof Array) {
	            var instances = this[key];
	            for(var i=0; i<instances.length; i++){
	                if(instances[i]._deleted){
	                    instances.splice(i,1);
	                }
	            }
	        }
	    }
	}

	Sprites.prototype.clear = function(){
	    for(var key in this){
	        delete this[key];
	    }
	};

	module.exports = Sprites;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function EventList(io, debugMode){
	    this.pool=[];
	    this.io=io;
	    this.debugMode = debugMode || false;
	}

	EventList.prototype.traverse = function (){
	    var pool = this.pool,
	        io = this.io,
	        debugMode = this.debugMode;
	    for(var i=0; i<pool.length; i++){
	        if (pool[i].sprite && pool[i].sprite.constructor.name=="Sprite" && pool[i].sprite._deleted){ pool.splice(i,1); }
	        else if (pool[i].event=="hover")    { hoverJudger(   pool[i].sprite,  pool[i].handler, io.cursor,  debugMode ); }
	        else if (pool[i].event=="click")    { clickJudger(   pool[i].sprite,  pool[i].handler, io.clicked, debugMode ); }
	        else if (pool[i].event=="keydown")  { keydownJudger( pool[i].key,     pool[i].handler, io.keydown, debugMode ); }
	        else if (pool[i].event=="keyup")    { keydownJudger( pool[i].key,     pool[i].handler, io.keyup,   debugMode ); }
	        else if (pool[i].event=="holding")  { holdingJudger( pool[i].key,     pool[i].handler, io.holding, debugMode ); }
	        else if (pool[i].event=="touch")    {
	            if(!pool[i].sprites.length || pool[i].sprites.length<2){
	                console.log("You must pass a sprites array which length is bigger than 1 as the second argument!");
	                return;
	            }
	            touchJudger( pool[i].sprites, pool[i].handler, debugMode );
	        }
	    }
	    clearEventRecord(this.io);
	}

	EventList.prototype.clear = function(){
	    this.pool=[];
	}

	EventList.prototype.register = function(event, target, handler){
	    var eventObj = {
	        event:event,
	        handler:handler
	    }
	    // @TODO: target 型別偵測
	    if (event=="touch"){
	        eventObj.sprites = target;
	    } else if (event=="keydown" || event=="keyup" || event=="holding"){
	        eventObj.key = target;
	    } else if (event=="hover" || event=="click") {
	        eventObj.sprite = target;
	    }
	    this.pool.push(eventObj);
	};


	function hoverJudger(sprite, handler, cursor, debugMode){
	    if(sprite.touched(cursor)){
	        handler.call(sprite);
	        if(debugMode){
	            console.log("Just fired a hover handler at: ("+cursor.x+","+cursor.y+")");
	        }
	    }
	}

	function clickJudger(sprite, handler, clicked, debugMode){
	    if(clicked.x && clicked.y){ // 如果有點擊記錄才檢查
	        if(sprite){
	            // 如果是 Sprite, 則對其做判定
	            var crossX = (sprite.x+sprite.width/2)>clicked.x && clicked.x>(sprite.x-sprite.width/2),
	                crossY = (sprite.y+sprite.height/2)>clicked.y && clicked.y>(sprite.y-sprite.height/2);
	            if(crossX && crossY){
	                handler.call(sprite);
	                if(debugMode){
	                    console.log("Just fired a click handler on a sprite! ("+JSON.stringify(clicked)+")");
	                }
	            }
	        } else {
	            // 如果為 null, 則對整個遊戲舞台做判定
	            handler();
	            if(debugMode){
	                console.log("Just fired a click handler on stage! ("+JSON.stringify(clicked)+")");
	            }
	        }
	    }
	}

	function keydownJudger(key, handler, keydown, debugMode){
	    if(keydown[key]){
	        handler();
	        if(debugMode){
	            console.log("Just fired a keydown handler on: "+key);
	        }
	    }
	}

	function keyupJudger(key, handler, keyup, debugMode){
	    if(keyup[key]){
	        handler();
	        if(debugMode){
	            console.log("Just fired a keyup handler on: "+key);
	        }
	    }
	}

	function holdingJudger(key, handler, holding, debugMode){
	    if(holding[key]){
	        handler();
	        if(debugMode){
	            console.log("Just fired a holding handler on: "+key);
	        }
	    }
	}

	// @TODO: Now we could only detect Sprite instance, not include cursor.
	function touchJudger(sprites, handler, debugMode){
	    for(var i=1; i<sprites.length; i++){
	        if(!sprites[i-1].touched(sprites[i])){
	            return false;
	        }
	    }
	    handler();
	    if(debugMode){
	        console.log("Just fired a touch handler on: "+sprites);
	    }
	    return true; // we do not need this.
	}

	function clearEventRecord(io){
	    io.clicked.x=null;
	    io.clicked.y=null;
	    for(var key in io.keydown){
	        io.keydown[key]=false;
	        io.keyup[key]=false;
	    }
	}

	module.exports = EventList;

/***/ },
/* 5 */
/***/ function(module, exports) {

	function Inspector(){
	    this.fps = 0;
	    this._lastFrameUpdatedTime = (new Date()).getTime();
	}

	Inspector.prototype.updateFPS = function(){
	    var now = (new Date()).getTime();
	    this.fps = Math.round( 1000/(now-this._lastFrameUpdatedTime) );
	    this._lastFrameUpdatedTime = now;
	}

	module.exports = Inspector;

/***/ },
/* 6 */
/***/ function(module, exports) {

	//  state 用來表達 renderer 的以下狀態：
	//
	//   1. readyToStart:
	//      初始狀態，此時執行 start 會直接開始 cycling(不斷執行 onTick)，並將狀態切換為 "running"。
	//   2. running:
	//      不停 cycling，此時可執行 stop 將狀態切換為 "stopping"。
	//      但是執行 start 則不會有任何反應
	//      執行 stop 則不會有任何反應。
	//   3. stopping:
	//      此時雖然已接受到停止訊息，但是最後一次的 rendering 尚未結束，
	//      因此若在此時執行 start，會每隔一小段時間檢查 state 是否回復到 "readyToStart"。
	//
	//  狀態變化流程如下：
	//  (1) -> (2) -> (3) -> (1)

	var FPS = 60

	function Clock(update){
	    this._state = "readyToStart"; //"readyToStart", "stopping", "running";
	    this._update = update;
	}

	Clock.prototype.start = function(){
	    if(this._state==="readyToStart"){
	        var onTick;
	        this._state = "running";
	        onTick = (function(){
	            if(this._state==="running"){
	                this._update();
	                setTimeout(function(){
	                    requestAnimationFrame(onTick);
	                },1000/FPS);
	            } else {
	                this._state = "readyToStart";
	            }
	        }).bind(this);
	        setTimeout( onTick, 0 ); // 必須 Async，否則會產生微妙的時間差
	    } else if (this._state==="stopping") {
	        setTimeout( start, 10 );
	    }
	}

	Clock.prototype.stop = function(){
	    if(this._state==="running"){
	        this._state = "stopping";
	    }
	}

	module.exports = Clock;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var loader = new (__webpack_require__(8))();

	function Renderer(ctx, settings, debugMode){

	    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
	    // var stageWidth = settings.width,
	    //     stageHeight = settings.height;

	    var imageCache = {};

	    this.clear = function() {
	        ctx.clearRect(0,0,settings.width,settings.height);
	    };

	    this.print = function(words, x, y, color, size, font) {
	        x = x || 20;
	        y = y || 20;
	        size = size || 16; // Set or default
	        font = font || "Arial";
	        ctx.font = (size*settings.ratio)+"px " + font;
	        ctx.fillStyle = color || "black";
	        ctx.fillText(words, x * settings.ratio, y * settings.ratio);
	    };

	    this.drawSprites = function(sprites){
	        sprites.each(this.drawInstance);
	    };

	    this.drawInstance = function(instance){
	        if(!instance.hidden){
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            var img = getImgFromCache(instance.getCurrentCostume());
	            instance.width = img.width * instance.scale;
	            instance.height = img.height * instance.scale;
	            ctx.drawImage(  img,
	                            (instance.x-instance.width/2) * settings.ratio,
	                            (instance.y-instance.height/2) * settings.ratio,
	                            instance.width * settings.ratio,
	                            instance.height * settings.ratio
	            );
	        }
	    };

	    this.getImgFromCache = getImgFromCache;

	    // @Params:
	    // - src: backdrop image location
	    // - options: {x:number, y:number, width:number, height:number}
	    this.drawBackdrop = function(src, x, y, width, height){
	        if(src[0]=='#'){
	            ctx.fillStyle=src;
	            ctx.fillRect(0,0,settings.width*settings.ratio,settings.height*settings.ratio);
	        } else {
	            var img = imageCache[src];
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            if( !img ){
	                img=new Image();
	                img.src=src;
	                imageCache[src]=img;
	            }
	            ctx.drawImage(
	                img,
	                (x||0)*settings.ratio,
	                (y||0)*settings.ratio,
	                (width||img.width)*settings.ratio,
	                (height||img.height)*settings.ratio
	            );
	        }
	    };

	    this.preload = function(images, completeFunc, progressFunc){
	        var loaderProxy = {};
	        if(completeFunc){
	            onComplete(completeFunc);
	        }
	        if(progressFunc){
	            onProgress(progressFunc);
	        }
	        for(var i=0; i<images.length; i++){
	            var path = images[i];
	            imageCache[path] = loader.addImage(path);
	        }
	        function onComplete(callback){
	            loader.addCompletionListener(function(){
	                callback();
	            });
	        };
	        function onProgress(callback){
	            loader.addProgressListener(function(e) {
	                // e.completedCount, e.totalCount, e.resource.imageNumber
	                callback(e);
	            });
	        }
	        loaderProxy.complete = onComplete;
	        loaderProxy.progress = onProgress;
	        loader.start();
	        if(debugMode){
	            console.log("Start loading "+images.length+" images...");
	            loader.addProgressListener(function(e) {
	                console.log("Preloading progressing...");
	            });
	            loader.addCompletionListener(function(){
	                console.log("Preloading completed!");
	            });
	        }
	        return loaderProxy;
	    };

	    function getImgFromCache(path){
	        var img = imageCache[path];
	        if( !img ){
	            img=new Image();
	            img.src=path;
	            imageCache[path]=img;
	        }
	        return img;
	    }
	}

	module.exports = Renderer;

/***/ },
/* 8 */
/***/ function(module, exports) {

	/*!  | http://thinkpixellab.com/PxLoader */
	/*
	 * PixelLab Resource Loader
	 * Loads resources while providing progress updates.
	 */

	function PxLoader(settings) {

	    // merge settings with defaults
	    settings = settings || {};
	    this.settings = settings;

	    // how frequently we poll resources for progress
	    if (settings.statusInterval == null) {
	        settings.statusInterval = 5000; // every 5 seconds by default
	    }

	    // delay before logging since last progress change
	    if (settings.loggingDelay == null) {
	        settings.loggingDelay = 20 * 1000; // log stragglers after 20 secs
	    }

	    // stop waiting if no progress has been made in the moving time window
	    if (settings.noProgressTimeout == null) {
	        settings.noProgressTimeout = Infinity; // do not stop waiting by default
	    }

	    var entries = [],
	        // holds resources to be loaded with their status
	        completionListeners = [],
	        progressListeners = [],
	        timeStarted, progressChanged = Date.now();

	    /**
	     * The status of a resource
	     * @enum {number}
	     */
	    var ResourceState = {
	        QUEUED: 0,
	        WAITING: 1,
	        LOADED: 2,
	        ERROR: 3,
	        TIMEOUT: 4
	    };

	    // places non-array values into an array.
	    var ensureArray = function(val) {
	        if (val == null) {
	            return [];
	        }

	        if (Array.isArray(val)) {
	            return val;
	        }

	        return [val];
	    };

	    // add an entry to the list of resources to be loaded
	    this.add = function(resource) {

	        // TODO: would be better to create a base class for all resources and
	        // initialize the PxLoaderTags there rather than overwritting tags here
	        resource.tags = new PxLoaderTags(resource.tags);

	        // ensure priority is set
	        if (resource.priority == null) {
	            resource.priority = Infinity;
	        }

	        entries.push({
	            resource: resource,
	            status: ResourceState.QUEUED
	        });
	    };

	    this.addProgressListener = function(callback, tags) {
	        progressListeners.push({
	            callback: callback,
	            tags: new PxLoaderTags(tags)
	        });
	    };

	    this.addCompletionListener = function(callback, tags) {
	        completionListeners.push({
	            tags: new PxLoaderTags(tags),
	            callback: function(e) {
	                if (e.completedCount === e.totalCount) {
	                    callback(e);
	                }
	            }
	        });
	    };

	    // creates a comparison function for resources
	    var getResourceSort = function(orderedTags) {

	        // helper to get the top tag's order for a resource
	        orderedTags = ensureArray(orderedTags);
	        var getTagOrder = function(entry) {
	            var resource = entry.resource,
	                bestIndex = Infinity;
	            for (var i = 0; i < resource.tags.length; i++) {
	                for (var j = 0; j < Math.min(orderedTags.length, bestIndex); j++) {
	                    if (resource.tags.all[i] === orderedTags[j] && j < bestIndex) {
	                        bestIndex = j;
	                        if (bestIndex === 0) {
	                            break;
	                        }
	                    }
	                    if (bestIndex === 0) {
	                        break;
	                    }
	                }
	            }
	            return bestIndex;
	        };
	        return function(a, b) {
	            // check tag order first
	            var aOrder = getTagOrder(a),
	                bOrder = getTagOrder(b);
	            if (aOrder < bOrder) { return -1; }
	            if (aOrder > bOrder) { return 1; }

	            // now check priority
	            if (a.priority < b.priority) { return -1; }
	            if (a.priority > b.priority) { return 1; }
	            return 0;
	        };
	    };

	    this.start = function(orderedTags) {
	        timeStarted = Date.now();

	        // first order the resources
	        var compareResources = getResourceSort(orderedTags);
	        entries.sort(compareResources);

	        // trigger requests for each resource
	        for (var i = 0, len = entries.length; i < len; i++) {
	            var entry = entries[i];
	            entry.status = ResourceState.WAITING;
	            entry.resource.start(this);
	        }

	        // do an initial status check soon since items may be loaded from the cache
	        setTimeout(statusCheck, 100);
	    };

	    var statusCheck = function() {
	        var checkAgain = false,
	            noProgressTime = Date.now() - progressChanged,
	            timedOut = (noProgressTime >= settings.noProgressTimeout),
	            shouldLog = (noProgressTime >= settings.loggingDelay);

	        for (var i = 0, len = entries.length; i < len; i++) {
	            var entry = entries[i];
	            if (entry.status !== ResourceState.WAITING) {
	                continue;
	            }

	            // see if the resource has loaded
	            if (entry.resource.checkStatus) {
	                entry.resource.checkStatus();
	            }

	            // if still waiting, mark as timed out or make sure we check again
	            if (entry.status === ResourceState.WAITING) {
	                if (timedOut) {
	                    entry.resource.onTimeout();
	                } else {
	                    checkAgain = true;
	                }
	            }
	        }

	        // log any resources that are still pending
	        if (shouldLog && checkAgain) {
	            log();
	        }

	        if (checkAgain) {
	            setTimeout(statusCheck, settings.statusInterval);
	        }
	    };

	    this.isBusy = function() {
	        for (var i = 0, len = entries.length; i < len; i++) {
	            if (entries[i].status === ResourceState.QUEUED || entries[i].status === ResourceState.WAITING) {
	                return true;
	            }
	        }
	        return false;
	    };

	    var onProgress = function(resource, statusType) {

	        var entry = null,
	            i, len, listeners, listener, shouldCall;

	        // find the entry for the resource
	        for (i = 0, len = entries.length; i < len; i++) {
	            if (entries[i].resource === resource) {
	                entry = entries[i];
	                break;
	            }
	        }

	        // we have already updated the status of the resource
	        if (entry == null || entry.status !== ResourceState.WAITING) {
	            return;
	        }
	        entry.status = statusType;
	        progressChanged = Date.now();

	        // ensure completion listeners fire after progress listeners
	        listeners = progressListeners.concat( completionListeners );

	        // fire callbacks for interested listeners
	        for (i = 0, len = listeners.length; i < len; i++) {

	            listener = listeners[i];
	            if (listener.tags.length === 0) {
	                // no tags specified so always tell the listener
	                shouldCall = true;
	            } else {
	                // listener only wants to hear about certain tags
	                shouldCall = resource.tags.intersects(listener.tags);
	            }

	            if (shouldCall) {
	                sendProgress(entry, listener);
	            }
	        }
	    };

	    this.onLoad = function(resource) {
	        onProgress(resource, ResourceState.LOADED);
	    };
	    this.onError = function(resource) {
	        onProgress(resource, ResourceState.ERROR);
	    };
	    this.onTimeout = function(resource) {
	        onProgress(resource, ResourceState.TIMEOUT);
	    };

	    // sends a progress report to a listener
	    var sendProgress = function(updatedEntry, listener) {
	        // find stats for all the resources the caller is interested in
	        var completed = 0,
	            total = 0,
	            i, len, entry, includeResource;
	        for (i = 0, len = entries.length; i < len; i++) {

	            entry = entries[i];
	            includeResource = false;

	            if (listener.tags.length === 0) {
	                // no tags specified so always tell the listener
	                includeResource = true;
	            } else {
	                includeResource = entry.resource.tags.intersects(listener.tags);
	            }

	            if (includeResource) {
	                total++;
	                if (entry.status === ResourceState.LOADED ||
	                    entry.status === ResourceState.ERROR ||
	                    entry.status === ResourceState.TIMEOUT) {

	                    completed++;
	                }
	            }
	        }

	        listener.callback({
	            // info about the resource that changed
	            resource: updatedEntry.resource,

	            // should we expose StatusType instead?
	            loaded: (updatedEntry.status === ResourceState.LOADED),
	            error: (updatedEntry.status === ResourceState.ERROR),
	            timeout: (updatedEntry.status === ResourceState.TIMEOUT),

	            // updated stats for all resources
	            completedCount: completed,
	            totalCount: total
	        });
	    };

	    // prints the status of each resource to the console
	    var log = this.log = function(showAll) {
	        if (!window.console) {
	            return;
	        }

	        var elapsedSeconds = Math.round((Date.now() - timeStarted) / 1000);
	        window.console.log('PxLoader elapsed: ' + elapsedSeconds + ' sec');

	        for (var i = 0, len = entries.length; i < len; i++) {
	            var entry = entries[i];
	            if (!showAll && entry.status !== ResourceState.WAITING) {
	                continue;
	            }

	            var message = 'PxLoader: #' + i + ' ' + entry.resource.getName();
	            switch(entry.status) {
	                case ResourceState.QUEUED:
	                    message += ' (Not Started)';
	                    break;
	                case ResourceState.WAITING:
	                    message += ' (Waiting)';
	                    break;
	                case ResourceState.LOADED:
	                    message += ' (Loaded)';
	                    break;
	                case ResourceState.ERROR:
	                    message += ' (Error)';
	                    break;
	                case ResourceState.TIMEOUT:
	                    message += ' (Timeout)';
	                    break;
	            }

	            if (entry.resource.tags.length > 0) {
	                message += ' Tags: [' + entry.resource.tags.all.join(',') + ']';
	            }

	            window.console.log(message);
	        }
	    };
	}


	// Tag object to handle tag intersection; once created not meant to be changed
	// Performance rationale: http://jsperf.com/lists-indexof-vs-in-operator/3

	function PxLoaderTags(values) {

	    this.all = [];
	    this.first = null; // cache the first value
	    this.length = 0;

	    // holds values as keys for quick lookup
	    this.lookup = {};

	    if (values) {

	        // first fill the array of all values
	        if (Array.isArray(values)) {
	            // copy the array of values, just to be safe
	            this.all = values.slice(0);
	        } else if (typeof values === 'object') {
	            for (var key in values) {
	                if(values.hasOwnProperty(key)) {
	                    this.all.push(key);
	                }
	            }
	        } else {
	            this.all.push(values);
	        }

	        // cache the length and the first value
	        this.length = this.all.length;
	        if (this.length > 0) {
	            this.first = this.all[0];
	        }

	        // set values as object keys for quick lookup during intersection test
	        for (var i = 0; i < this.length; i++) {
	            this.lookup[this.all[i]] = true;
	        }
	    }
	}

	// compare this object with another; return true if they share at least one value
	PxLoaderTags.prototype.intersects = function(other) {

	    // handle empty values case
	    if (this.length === 0 || other.length === 0) {
	        return false;
	    }

	    // only a single value to compare?
	    if (this.length === 1 && other.length === 1) {
	        return this.first === other.first;
	    }

	    // better to loop through the smaller object
	    if (other.length < this.length) {
	        return other.intersects(this);
	    }

	    // loop through every key to see if there are any matches
	    for (var key in this.lookup) {
	        if (other.lookup[key]) {
	            return true;
	        }
	    }

	    return false;
	};

	function PxLoaderImage(url, tags, priority, options) {
	    options = options || {};

	    var self = this,
	        loader = null,
	        img;

	    img = this.img = new Image();
	    if (options.origin) {
	        img.crossOrigin = options.origin;
	    }

	    this.tags = tags;
	    this.priority = priority;

	    var onReadyStateChange = function() {
	        if (self.img.readyState !== 'complete') {
	            return;
	        }

	        onLoad();
	    };

	    var onLoad = function() {
	        loader.onLoad(self);
	        cleanup();
	    };

	    var onError = function() {
	        loader.onError(self);
	        cleanup();
	    };

	    var onTimeout = function() {
	        loader.onTimeout(self);
	        cleanup();
	    };

	    var cleanup = function() {
	        self.unbind('load', onLoad);
	        self.unbind('readystatechange', onReadyStateChange);
	        self.unbind('error', onError);
	    };

	    this.start = function(pxLoader) {
	        // we need the loader ref so we can notify upon completion
	        loader = pxLoader;

	        // NOTE: Must add event listeners before the src is set. We
	        // also need to use the readystatechange because sometimes
	        // load doesn't fire when an image is in the cache.
	        self.bind('load', onLoad);
	        self.bind('readystatechange', onReadyStateChange);
	        self.bind('error', onError);

	        self.img.src = url;
	    };

	    // called by PxLoader to check status of image (fallback in case
	    // the event listeners are not triggered).
	    this.checkStatus = function() {
	        onReadyStateChange();
	    };

	    // called by PxLoader when it is no longer waiting
	    this.onTimeout = function() {
	        if (self.img.complete) {
	            onLoad();
	        } else {
	            onTimeout();
	        }
	    };

	    // returns a name for the resource that can be used in logging
	    this.getName = function() {
	        return url;
	    };

	    // cross-browser event binding
	    this.bind = function(eventName, eventHandler) {
	        self.img.addEventListener(eventName, eventHandler, false);
	    };

	    // cross-browser event un-binding
	    this.unbind = function(eventName, eventHandler) {
	        self.img.removeEventListener(eventName, eventHandler, false);
	    };

	}

	// add a convenience method to PxLoader for adding an image
	PxLoader.prototype.addImage = function(url, tags, priority, options) {
	    var imageLoader = new PxLoaderImage(url, tags, priority, options);
	    this.add(imageLoader);

	    // return the img element to the caller
	    return imageLoader.img;
	};

	module.exports = PxLoader;

/***/ },
/* 9 */
/***/ function(module, exports) {

	function Sound(debugMode){
	    this.sounds = [];
	    // this.generate = function(url){
	    //     return (function(){
	    //         var sound = new Audio(url),
	    //             obj = {};
	    //         sounds.push(sound);
	    //         obj.play = function(url){
	    //             sound.load();
	    //             sound.play();
	    //         };
	    //         obj.stop = function(){
	    //             sound.pause();
	    //             sound.currentTime = 0;
	    //         };
	    //         return obj;
	    //     })()
	    // }
	    this.play = function(url){
	        var sounds = this.sounds;
	        return (function(){
	            var sound = new Audio(url);
	            var index = sounds.length;
	            sounds.push(sound);
	            sound.play();
	            sound.addEventListener('ended', function(){
	                sounds[index] = null;
	                sound = null;
	            });
	            return sound;
	        })();
	    }
	    this.stop = function(){
	        for(var i=0; i<this.sounds.length; i++){
	            if(this.sounds[i]){
	                this.sounds[i].pause();
	            }
	        }
	    }
	}

	module.exports = Sound;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var keycode = __webpack_require__(11);

	var io = function(canvas, settings, debugMode){

	    var exports={},
	        cursor={x:0, y:0},
	        key=[],
	        clicked={x:null, y:null},
	        keyup={},
	        keydown={},
	        holding={};

	    debugMode = debugMode || false;

	    // Make any element focusable for keydown event.
	    canvas.setAttribute("tabindex",'1');
	    canvas.style.outline = "none";

	    canvas.addEventListener("mousemove", function(e){
	        cursor.x = e.offsetX / settings.ratio;
	        cursor.y = e.offsetY / settings.ratio;
	    });

	    canvas.addEventListener("click", function(e){
	        clicked.x = e.offsetX / settings.ratio;
	        clicked.y = e.offsetY / settings.ratio;
	        if(debugMode){
	            console.log( "Clicked! cursor:"+JSON.stringify(cursor) );
	        }
	    });

	    canvas.addEventListener("keydown", function(e){
	        var key = keycode(e.keyCode);
	        keydown[key] = true;
	        holding[key] = true;
	        if(debugMode){
	            console.log( "Keydown! key:"+key );
	        }
	    });

	    canvas.addEventListener("keyup", function(e){
	        var key = keycode(e.keyCode);
	        keyup[key] = true;
	        holding[key] = false;
	        if(debugMode){
	            console.log( "Keyup! key:"+key );
	        }
	    });

	    exports.cursor = cursor;
	    exports.clicked = clicked;
	    exports.keyup = keyup;
	    exports.keydown = keydown;
	    exports.holding = holding;
	    return exports;
	};

	module.exports = io;

/***/ },
/* 11 */
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


/***/ }
/******/ ]);