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
	var Sound = __webpack_require__(8);
	var Loader = __webpack_require__(9);
	var IO = __webpack_require__(10);

	function engine(stageId, debugMode){

	    var canvas= document.getElementById(stageId);
	    var ctx = canvas.getContext("2d");

	    var settings = {
	        width: canvas.width,
	        height: canvas.height,
	        zoom: 1,
	        // gravity: 0, //@TODO: set gravity
	        updateFunctions: []
	    };

	    var loader = new Loader();
	    var sprites = new Sprites();
	    var inspector = new Inspector();
	    var io = new IO(canvas, settings, debugMode);
	    var eventList = new EventList(io, debugMode);
	    var renderer = new Renderer(ctx, settings, loader.images, debugMode);
	    var sound = new Sound(loader.sounds, debugMode);
	    var clock = new Clock(function(){
	        if(background.path){
	            renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
	        }
	        eventList.traverse();
	        for(var i=0; i<settings.updateFunctions.length; i++){
	            settings.updateFunctions[i]();
	        };
	        sprites.removeDeletedSprites();
	        sprites.runOnTick();
	        inspector.updateFPS();
	        renderer.drawSprites(sprites);
	        renderer.drawTexts();
	    });

	    var background={
	        path: "#ffffff"
	    };    

	    debugMode = debugMode || false;

	    function set(args){
	        if(args.width) canvas.width = settings.width = args.width;
	        if(args.height) canvas.height = settings.height = args.height;
	        if(args.zoom) {
	            settings.zoom = args.zoom;
	            canvas.style.width = canvas.width * settings.zoom + 'px';
	            canvas.style.height = canvas.height * settings.zoom + 'px';
	        }
	        settings.gravity = args.gravity || settings.gravity;
	        settings.update = args.update || settings.update;
	        return this;
	    }

	    // for proxy.setBackdrop, setBackground
	    function setBackground (path, x, y, w, h) {
	        background.path = path;
	        background.x = x;
	        background.y = y;
	        background.w = w;
	        background.h = h;
	    }

	    // for proxy.on / when: 
	    var when = function(event, target, handler){
	        // Global when() only accepts followed events:
	        if(["keydown", "keyup", "mousedown", "mouseup", "holding", "click"].includes(event)){
	            if(typeof target === "function"){ // 如果不指定對象，直接傳入 handler
	                eventList.register(event, null, target);
	            } else {
	                eventList.register(event, target, handler);
	            }
	        }
	    }
	    var proxy = {
	        createSprite: function(args){
	            var newSprite = new Sprite(args, eventList, settings, renderer)
	            sprites._sprites.push(newSprite);
	            sprites._sprites.sort(function(a, b){return a.layer-b.layer;}); // 針對 z-index 做排序，讓越大的排在越後面，可以繪製在最上層
	            return newSprite;
	        },
	        print: renderer.print,
	        setBackground: setBackground,
	        setBackdrop: setBackground,
	        cursor: io.cursor,
	        key: io.holding,
	        inspector: inspector,
	        when: when,
	        on: when,
	        set: set,
	        stop: function(){ clock.stop(); sound.stop(); },
	        start: function(){ clock.start(); },
	        update: function(func){ settings.updateFunctions.push(func); },
	        always: function(func){ settings.updateFunctions.push(func); },
	        forever: function(func){ settings.updateFunctions.push(func); },
	        ctx: ctx,
	        clear: function(){ renderer.clear(); },
	        preload: function(assets, completeFunc, progressFunc) { loader.preload(assets, completeFunc, progressFunc) },
	        sound: sound,
	        broadcast: eventList.emit.bind(eventList),

	        // Will be deprecated:
	        drawBackdrop: function(src, x, y, width, height){ renderer.drawBackdrop(src, x, y, width, height); },
	        drawSprites: function(){ renderer.drawSprites(sprites); }
	    };
	    if(debugMode){
	        proxy.eventList = eventList;
	    }
	    return proxy;
	}

	window.Engine = engine;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var util = __webpack_require__(2);
	var hitCanvas = document.createElement('canvas'),
	    hitTester = hitCanvas.getContext('2d');
	    // document.body.appendChild(hitCanvas);

	// @TODO:  
	function Sprite(args, eventList, settings, renderer) {

	    if (args.constructor === String || args.constructor === Array) {
	        args = { costumes: [].concat(args) }
	    }

	    this.x = util.isNumeric(args.x) ? args.x : settings.width/2;
	    this.y = util.isNumeric(args.y) ? args.y : settings.height/2;
	    this.width = 1;
	    this.height = 1;
	    this.direction = args.direction || 0;
	    this.rotationStyle = args.rotationStyle || "full"; // "full", "flipped" and "fixed"
	    this.scale = args.scale || 1;
	    this.costumes = [].concat(args.costumes); // Deal with single string
	    this.hidden = args.hidden || false;
	    this.layer = util.isNumeric(args.layer) ? args.layer : 0;
	    this.opacity = util.isNumeric(args.opacity) ? args.opacity : 1;
	    this.costumeId = 0;

	    this._onTickFuncs = [];
	    this._deleted = false;

	    this._eventList = eventList;
	    this._settings = settings;
	    this._renderer = renderer;

	    this._animation = { frames: [], rate: 5, timer: 0 }
	}

	Sprite.prototype.update = function () {
	    this._updateDirection();
	    this._updateFrames();
	    for (var i=0; i < this._onTickFuncs.length; i++) {
	        this._onTickFuncs[i].call(this);
	    }
	}

	Sprite.prototype._updateDirection = function () {
	    this.direction = this.direction % 360;
	    if(this.direction < 0) this.direction += 360;
	}

	Sprite.prototype._updateFrames = function () {
	    var animate = this._animation;
	    if(animate.frames.length > 0) {
	        var now = new Date().getTime();
	        if(now >= animate.timer + 1000 / animate.rate) {
	            animate.timer = now;
	            this.costumeId = animate.frames.shift();
	            if(animate.frames.length <= 0 && animate.callback) animate.callback();
	        }
	    }
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
	    this.x += Math.sin(rad)*distance;
	    this.y -= Math.cos(rad)*distance;
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
	    rad = Math.atan2(offsetX, -offsetY); // 這裡的 offsetY 和數學坐標是反過來的
	    this.direction = util.radToDegree(rad);
	}

	Sprite.prototype.touched = function(){
	    if (arguments[0].constructor === Array) {
	        for(var i=0; i<arguments[0].length; i++){
	            if ( isTouched.call(this, arguments[0][i]) ){
	                return true;
	            }
	        }
	        return false;
	    } else {
	        return isTouched.apply(this, arguments);
	    }
	    
	};

	Sprite.prototype.distanceTo = function(){
	    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
	        return util.distanceBetween( this, arguments[0] );
	    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
	        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
	    }
	};

	Sprite.prototype.always = Sprite.prototype.forever = function(func){
	    this._onTickFuncs.push(func);
	};

	Sprite.prototype.when = Sprite.prototype.on = function() {

	    var event = arguments[0];
	    var eventList = this._eventList;

	    if(event=="listen") {
	        return eventList.register(event, arguments[1], this, arguments[2]);
	    } else if(["mousedown", "mouseup", "hover", "click"].includes(event)){
	        return eventList.register(event, this, arguments[1]);
	    } else if (event=="touch"){
	        return eventList.register(event, this, arguments[1], arguments[2]);
	    } else {
	        console.log('Sprite.on() does only support "listen", "click", hover" and "touch" events');
	        return false;
	    }
	};

	Sprite.prototype.destroy = function(){
	    this._deleted = true;
	};

	Sprite.prototype.getCurrentCostume = function(){
	    var id = this.costumeId;
	    return this.costumes[id];
	};

	Sprite.prototype.animate = function (frames, frameRate, callback) {
	    this._animation = {
	        frames: frames,
	        rate: frameRate || 5,
	        callback: callback,
	        timer: 0
	    }
	}

	Sprite.prototype.nextCostume = function () {
	    this.costumeId += 1;
	    if(this.costumeId >= this.costumes.length) {
	        this.costumeId = 0;
	    }
	}

	function isTouched(sprite, args){

	    // 如果此角色為隱藏，不進行檢驗，直接回傳 false
	    if (this.hidden) { return false; }

	    // 由於效能考量，先用成本最小的「座標範圍演算法」判斷是否有機會「像素重疊」
	    var crossX = crossY = false;

	    if( arguments[0] instanceof Sprite ){

	        // 如果目標角色是自己，不進行檢驗，直接回傳 false (因為自己一定會碰到自己)
	        if (this == arguments[0]) { return false; }

	        // 如果目標角色為隱藏，不進行檢驗，直接回傳 false
	        if (arguments[0].hidden) { return false; }

	        var target = arguments[0];
	        if(target._deleted){
	            return false;
	        }
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

	        if(!this._renderer) return console.log(this);

	        hitTester.globalCompositeOperation = 'source-over';
	        hitTester.drawImage(    renderer.getImgFromCache(this.getCurrentCostume()),
	                                this.x-this.width/2, this.y-this.height/2,
	                                this.width, this.height );

	        hitTester.globalCompositeOperation = 'source-in';
	        if( arguments[0] instanceof Sprite ){
	            var target = arguments[0];
	            hitTester.drawImage(    renderer.getImgFromCache(target.getCurrentCostume()),
	                                    target.x-target.width/2, target.y-target.height/2,
	                                    target.width, target.height );
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
	    rad = rad%(Math.PI*2);
	    if(rad<0) rad += Math.PI*2;
	    return rad*180/Math.PI;
	}
	util.degreeToRad = function(degree){
	    degree = degree%360;
	    if(degree<0) degree += 360;
	    return degree/180*Math.PI;
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

	function Sprites(){
	    this._sprites = [];
	}

	Sprites.prototype.runOnTick = function(){
	    this.each(function(){
	        this.update();
	    });
	}

	Sprites.prototype.each = function(func){
	    var sprites = this._sprites;
	    for(var i=0; i<sprites.length; i++){
	        func.call(sprites[i],sprites[i]);
	    }
	}

	Sprites.prototype.removeDeletedSprites = function(){
	    var sprites = this._sprites;
	    for(var i=0; i<sprites.length; i++){
	        if(sprites[i]._deleted){
	            sprites.splice(i,1);
	        }
	    }
	}

	Sprites.prototype.clear = function(){
	    this._sprites = [];
	};

	module.exports = Sprites;

/***/ },
/* 4 */
/***/ function(module, exports) {

	function EventList(io, debugMode){
	    this.pool=[];
	    this.messages = [];
	    this.io=io;
	    this.debugMode = debugMode || false;
	}

	EventList.prototype.traverse = function (){
	    var pool = this.pool,
	        io = this.io,
	        messages = this.messages,
	        debugMode = this.debugMode;
	    for(var i=0; i<pool.length; i++){
	        if (pool[i].sprite || pool[i].sprites) {
	            var sprite = pool[i].sprite || pool[i].sprites[0];
	            if (sprite.constructor.name=="Sprite" && sprite._deleted){ 
	                pool.splice(i,1);
	                continue;
	            }
	        }
	        if      (pool[i].event=="hover")        hoverJudger(   pool[i].sprite, pool[i].handler, io.cursor,  debugMode);
	        else if (pool[i].event=="click")        mouseJudger(   pool[i].sprite, pool[i].handler, io.clicked, debugMode);
	        else if (pool[i].event=="mousedown")    mouseJudger(   pool[i].sprite, pool[i].handler, io.mousedown, debugMode);
	        else if (pool[i].event=="mouseup")      mouseJudger(   pool[i].sprite, pool[i].handler, io.mouseup, debugMode);
	        else if (pool[i].event=="keydown")      keydownJudger( pool[i].key,    pool[i].handler, io.keydown, debugMode);
	        else if (pool[i].event=="keyup")        keydownJudger( pool[i].key,    pool[i].handler, io.keyup,   debugMode);
	        else if (pool[i].event=="holding")      holdingJudger( pool[i].key,    pool[i].handler, io.holding, debugMode);
	        else if (pool[i].event=="listen")       listenJudger(  pool[i].sprite, pool[i].handler, messages,   pool[i].message, debugMode);
	        else if (pool[i].event=="touch")        touchJudger(   pool[i].sprite, pool[i].handler, pool[i].targets, debugMode );
	    }
	    io.clearEvents();
	    this._clearMessages();
	}

	EventList.prototype._clearMessages = function () {
	    this.messages = [];
	}

	EventList.prototype.clear = function(){
	    this.pool=[];
	}

	EventList.prototype.register = function(){

	    var event = arguments[0];
	    var eventObj = {
	        event: event,
	        handler: arguments[arguments.length - 1]
	    }

	    if (event === "touch"){
	        eventObj.sprite = arguments[1];
	        if(arguments[2].constructor === Array) {
	            eventObj.targets = arguments[2];
	        } else {
	            eventObj.targets = [arguments[2]];
	        }
	    } else if (event === "keydown" || event === "keyup" || event === "holding"){
	        eventObj.key = arguments[1];
	    } else if ( ["mousedown", "mouseup", "hover", "click"].includes(event) ) {
	        eventObj.sprite = arguments[1];
	    } else if (event === "listen") {
	        eventObj.message = arguments[1];
	        eventObj.sprite = arguments[2];
	    }

	    this.pool.push(eventObj);
	}

	EventList.prototype.emit = function (eventName) {
	    this.messages.push(eventName);
	}

	function hoverJudger(sprite, handler, cursor, debugMode){
	    if(sprite.touched(cursor)){
	        handler.call(sprite);
	        if(debugMode){
	            console.log("Just fired a hover handler at: ("+cursor.x+","+cursor.y+")");
	        }
	    }
	}

	// 用來判斷 click, mousedown, mouseup 的 function
	function mouseJudger(sprite, handler, mouse, debugMode){
	    if(mouse.x && mouse.y){ // 如果有點擊記錄才檢查
	        if(sprite){ // 如果是 Sprite, 則對其做判定
	            if( sprite.touched(mouse.x,mouse.y) ){
	                handler.call(sprite);
	                if(debugMode){
	                    console.log("Just fired a click handler on a sprite! ("+JSON.stringify(mouse)+")");
	                }
	            }
	        } else { // 如果為 null, 則對整個遊戲舞台做判定
	            handler();
	            if(debugMode){
	                console.log("Just fired a click handler on stage! ("+JSON.stringify(mouse)+")");
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

	function listenJudger(sprite, handler, messages, message, debugMode) {
	    if(messages.includes(message)) {
	        handler.call(sprite);
	        if(debugMode) {
	            // console.log('listen event');
	        }
	    }
	}

	// @TODO: Now we could only detect Sprite instance, not include cursor.
	function touchJudger(sprite, handler, targets, debugMode) {
	    for(var i=0, target; target = targets[i]; i++) {
	        if(sprite.touched(target)) {
	            handler.call(sprite, target);
	            if(debugMode) {
	                console.log({event: "Touch", "sprite": sprite, "target": target});
	            }
	        }
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

	var util = __webpack_require__(2);

	function Renderer(ctx, settings, images, debugMode){

	    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
	    // var stageWidth = settings.width,
	    //     stageHeight = settings.height;

	    var imageCache = images;
	    var texts = [];

	    this.clear = function() {
	        ctx.clearRect(0,0,settings.width,settings.height);
	    };

	    this.print = function(words, x, y, color, size, font) {
	        texts.push({
	            words: words,
	            x: util.isNumeric(x) ? x : 20,
	            y: util.isNumeric(y) ? y : 20,
	            color: color || 'black',
	            size: size || 16,
	            font: font || 'Arial'
	        })
	    };

	    this.drawTexts = function () {
	        for(var i=0; i<texts.length; i++) {
	            var t = texts[i];
	            ctx.textBaseline = "top";
	            ctx.font = t.size + "px " + t.font;
	            ctx.fillStyle = t.color;
	            ctx.fillText(t.words, t.x, t.y);
	        }
	        texts = [];
	    }

	    this.drawSprites = function(sprites){
	        sprites.each(this.drawInstance);
	    };

	    this.drawInstance = function(instance){
	        // console.log(instance);
	        if(!instance.hidden){
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            var img = getImgFromCache(instance.getCurrentCostume());
	            instance.width = img.width * instance.scale;
	            instance.height = img.height * instance.scale;

	            var rad = util.degreeToRad(instance.direction);
	            ctx.globalAlpha = instance.opacity;
	            if (instance.rotationStyle === 'flipped') {
	                if(rad >= Math.PI) {
	                    ctx.translate(instance.x*2, 0);
	                    ctx.scale(-1, 1);
	                    ctx.drawImage(  img,
	                                    (instance.x-instance.width/2),
	                                    (instance.y-instance.height/2),
	                                    instance.width,
	                                    instance.height
	                    )
	                    ctx.scale(-1, 1);
	                    ctx.translate(-instance.x*2, 0);
	                    ctx.globalAlpha = 1;
	                    return;
	                } else {
	                    var rad = 0;
	                }
	            }
	            if(instance.rotationStyle === 'fixed') {
	                var rad = 0;
	            }
	            ctx.translate(instance.x, instance.y);
	            ctx.rotate(rad);
	            ctx.drawImage( img,
	                        (-instance.width / 2),
	                        (-instance.height / 2),
	                        instance.width,
	                        instance.height
	            );
	            ctx.rotate(-rad);
	            ctx.translate(-instance.x, -instance.y);
	            ctx.globalAlpha = 1;
	        }
	    };

	    this.getImgFromCache = getImgFromCache;

	    // @Params:
	    // - src: backdrop image location
	    // - options: {x:number, y:number, width:number, height:number}
	    this.drawBackdrop = function(src, x, y, width, height){
	        if(src.includes('.')) {
	            var img = imageCache[src];
	            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
	            if( !img ){
	                img=new Image();
	                img.src=src;
	                imageCache[src]=img;
	            }
	            ctx.drawImage(img, (x||0), (y||0), (width||img.width), (height||img.height));
	        } else {
	            ctx.fillStyle=src;
	            ctx.fillRect(0,0,settings.width, settings.height);
	        }
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

	function Sound (sounds, debugMode){
	    this.sounds = sounds;
	    this.playing = [];
	    this.muted = false;
	    this.volume = 1;
	}

	Sound.prototype = {

	    play: function(url, loop) {
	        var audio;
	        if(this.sounds[url]) {
	            audio = this.sounds[url].cloneNode();
	            this.playing.push(audio);
	            audio.play();
	        } else {
	            audio = new Audio(url);
	            this.sounds[url] = audio;
	            this.playing.push(audio);
	            audio.play();
	        }
	        audio.loop = loop;
	        audio.muted = this.muted;
	        audio.volume = this.volume;
	        return audio;
	    },

	    stop: function() {
	        for(var i=0; i< this.playing.length; i++) {
	            this.playing[i].pause();
	        }
	        this.playing = [];
	    },

	    mute: function(bool) {
	        this.muted = bool;
	        for(var i=0; i< this.playing.length; i++) {
	            this.playing[i].muted = bool;
	        }
	    },

	    setVolume: function(v) {
	        this.volume = v;
	        for(var i=0; i< this.playing.length; i++) {
	            this.playing[i].volume = v;
	        }
	    },

	    each: function(fn) {
	        for(var i=0; i< this.playing.length; i++) {
	            fn(this.playing[i]);
	        }
	    }
	}

	module.exports = Sound;

/***/ },
/* 9 */
/***/ function(module, exports) {

	function Loader () {
	    this.loaded = 0;
	    this.paths = [];
	    this.sounds = {};
	    this.images = {};
	    this.completeFunc;
	    this.progressFunc;
	}

	Loader.prototype = {

	    preload: function (paths, completeFunc, progressFunc) {

	        this.paths = paths;
	        this.completeFunc = completeFunc;
	        this.progressFunc = progressFunc;

	        for(var i=0; i<paths.length; i++) {
	            var path = paths[i];
	            var ext = path.split('.').pop();

	            if(['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
	                this._loadImage(path);
	            }
	            if(['mp3', 'ogg', 'wav'].includes(ext)) {
	                this._loadSound(path);
	            }
	        }
	    },

	    _loadImage: function (path) {
	        var instance = this;
	        var image = new Image();
	        image.src = path;
	        image.onload = function() {instance._loaded()};
	        this.images[path] = image;
	    },

	    _loadSound: function (path) {
	        var instance = this;
	        var audio = new Audio();
	        audio.src = path;
	        audio.addEventListener('canplaythrough', function() {instance._loaded()});
	        this.sounds[path] = audio;
	    },

	    _loaded: function () {
	        this.loaded += 1;
	        if(this.progressFunc) {
	            this.progressFunc(this.loaded, this.paths.length);
	        }
	        if(this.loaded === this.paths.length && this.completeFunc) {
	            this.completeFunc();
	        }
	    }

	}

	module.exports = Loader;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var keycode = __webpack_require__(11);

	function IO(canvas, settings, debugMode){
	    var exports={},
	        cursor={ x:0, y:0, isDown:false, left: false, right: false },
	        key=[],
	        clicked={x:null, y:null},
	        mousedown={x:null, y:null},
	        mouseup={x:null, y:null},
	        keyup={},
	        keydown={},
	        holding={};

	    this.mousedown = mousedown;
	    this.mouseup = mouseup;

	    debugMode = debugMode || false;

	    // Make any element focusable for keydown event.
	    canvas.setAttribute("tabindex",'1');
	    canvas.style.outline = "none";

	    canvas.oncontextmenu = function () {
	        return false;
	    }

	    canvas.addEventListener("mousedown", function(e){
	        if(e.which == 1) cursor.left = true;
	        if(e.which == 3) cursor.right = true;
	        cursor.isDown = true;
	        mousedown.x = e.offsetX / settings.zoom;
	        mousedown.y = e.offsetY / settings.zoom;
	    });

	    canvas.addEventListener("mouseup", function(e){
	        if(e.which == 1) cursor.left = false;
	        if(e.which == 3) cursor.right = false;
	        cursor.isDown = cursor.left || cursor.right;
	        mouseup.x = e.offsetX / settings.zoom;
	        mouseup.y = e.offsetY / settings.zoom;
	    });

	    canvas.addEventListener("mousemove", function(e){
	        cursor.x = e.offsetX / settings.zoom;
	        cursor.y = e.offsetY / settings.zoom;
	    });

	    canvas.addEventListener("click", function(e){
	        clicked.x = e.offsetX / settings.zoom;
	        clicked.y = e.offsetY / settings.zoom;
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

	    this.cursor = cursor;
	    this.clicked = clicked;
	    this.keyup = keyup;
	    this.keydown = keydown;
	    this.holding = holding;
	};

	IO.prototype.clearEvents = function(){
	    this.clicked.x=null;
	    this.clicked.y=null;
	    this.mousedown.x=null;
	    this.mousedown.y=null;
	    this.mouseup.x=null;
	    this.mouseup.y=null;
	    for(var key in this.keydown){
	        this.keydown[key]=false;
	        this.keyup[key]=false;
	    }
	}

	module.exports = IO;

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