(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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
                requestAnimationFrame(onTick);
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
},{}],3:[function(require,module,exports){
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
        if (pool[i].sprite && pool[i]._deleted) {
            pool.splice(i--, 1);
            continue;
        }
        if      (pool[i].event=="click")        mouseJudger(   pool[i].sprite, pool[i].handler, io.clicked, debugMode);
        else if (pool[i].event=="mousedown")    mouseJudger(   pool[i].sprite, pool[i].handler, io.mousedown, debugMode);
        else if (pool[i].event=="mouseup")      mouseJudger(   pool[i].sprite, pool[i].handler, io.mouseup, debugMode);
        else if (pool[i].event=="keydown")      keyJudger(     pool[i].key,    pool[i].handler, io.keydown, debugMode);
        else if (pool[i].event=="keyup")        keyJudger(     pool[i].key,    pool[i].handler, io.keyup,   debugMode);
        else if (pool[i].event=="holding")      keyJudger(     pool[i].key,    pool[i].handler, io.holding, debugMode);
        else if (pool[i].event=="touch")        touchJudger(   pool[i].sprite, pool[i].handler, pool[i].targets, debugMode );
    }
    io.clearEvents();
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
    } else if (["keydown", "keyup", "holding"].includes(event)){
        eventObj.key = arguments[1] || "any"; // 如果對象為 null 則為任意按鍵 "any"
    } else if (["mousedown", "mouseup", "click"].includes(event)) {
        eventObj.sprite = arguments[1];
    } else if (event === "listen") {
        eventObj.message = arguments[1];
        eventObj.sprite = arguments[2];
    }

    this.pool.push(eventObj);
}

EventList.prototype.emit = function (eventName) {
    for(var i=0; i<this.pool.length; i++) {
        var e = this.pool[i];
        if(e.event == 'listen' && e.message == eventName) {
            e.handler.call(e.sprite);
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

// 用來判斷 keydown, keyup, holding 的 function
function keyJudger(target, handler, keys, debugMode){
    if(keys[target]){
        handler();
        if(debugMode){
            console.log("Just fired a keydown handler on: "+key);
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
},{}],4:[function(require,module,exports){
var Sprite = require("./sprite");
var Sprites = require("./sprites");
var EventList = require("./event-list");
var Inspector = require("./inspector");
var Clock = require("./clock");
var Renderer = require("./renderer");
var Sound = require("./sound");
var Loader = require("./loader");
var IO = require("./io");
var Pen = require("./pen");

function engine(stageId, debugMode){

    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");

    var settings = {
        width: canvas.width,
        height: canvas.height,
        zoom: 1,
        updateFunctions: []
    };

    var autoRendering = true;

    var loader = new Loader();
    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = new IO(canvas, settings, debugMode);
    var eventList = new EventList(io, debugMode);
    var renderer = new Renderer(ctx, settings, loader.images, debugMode);
    var sound = new Sound(loader, debugMode);
    var pen = new Pen(ctx);
    var clock = new Clock(function(){
        eventList.traverse();
        for(var i=0; i<settings.updateFunctions.length; i++){
            settings.updateFunctions[i]();
        };
        sprites.removeDeletedSprites();
        sprites.runOnTick();
        inspector.updateFPS();
        if(autoRendering){
            renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
            renderer.drawSprites(sprites);
            pen.draw();
        }
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

    function print (text, x, y, color ,size, font) {
        var tmp_1 = pen.fillCOlor;
        var tmp_2 = pen.size;
        pen.fillColor = color || 'black';
        pen.size = size || 16;
        x = x == undefined ? 10 : x;
        y = y == undefined ? 10 : y;
        pen.drawText(text, x, y, font);
        pen.fillColor = tmp_1;
        pen.size = tmp_2;
    }

    // for proxy.on / when: 
    function when (event, target, handler){
        // Global when() only accepts followed events:
        if(["keydown", "keyup", "mousedown", "mouseup", "holding", "click"].includes(event)){
            if(typeof target === "function"){ // 如果不指定對象，直接傳入 handler
                eventList.register(event, null, target);
            } else {
                eventList.register(event, target, handler);
            }
        }
    }

    function forever (func) {
        settings.updateFunctions.push(func);
    }

    function preload (assets, completeFunc, progressFunc) {
        loader.preload(assets, completeFunc, progressFunc);
    }

    var proxy = {
        createSprite: function(args){
            var newSprite = new Sprite(args, eventList, settings, renderer)
            sprites._sprites.push(newSprite);
            return newSprite;
        },
        print: print,
        setBackground: setBackground,
        setBackdrop: setBackground,
        cursor: io.cursor,
        key: io.holding,
        inspector: inspector,
        when: when,
        on: when,
        set: set,
        stop: function(){ 
            clock.stop(); 
            sound.stop();
            // 下面幾行是為了讓畫筆畫畫後馬上停止時，能夠正常顯現，所以最後需要畫一次
            // @TODO: 模組化
            if(autoRendering){
                renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
                renderer.drawSprites(sprites);
                pen.draw();
            }
        },
        stopRendering: function(){ autoRendering=false; },
        start: function(){ clock.start(); },
        forever: forever,
        update: forever,
        always: forever,
        clear: function(){ renderer.clear(); },
        preload: preload,
        sound: sound,
        broadcast: eventList.emit.bind(eventList),
        pen: pen,
        // 以下指令是給繪圖用的
        drawBackdrop: renderer.drawBackdrop,
        drawBackground: renderer.drawBackdrop,
        drawSprites: renderer.drawSprites
    };
    if(debugMode){
        proxy.eventList = eventList;
    }
    return proxy;
}

window.Engine = engine;
},{"./clock":2,"./event-list":3,"./inspector":5,"./io":6,"./loader":7,"./pen":8,"./renderer":9,"./sound":10,"./sprite":11,"./sprites":12}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
var keycode = require('keycode');

function IO(canvas, settings, debugMode){

    var cursor    = this.cursor    = { x: 0, y: 0, isDown: false, left: false, right: false }
    var clicked   = this.clicked   = { x: null, y: null }
    var mousedown = this.mousedown = { x: null, y: null }
    var mouseup   = this.mouseup   = { x: null, y: null }
    var keyup     = this.keyup     = { any: false }
    var keydown   = this.keydown   = { any: false }
    var holding   = this.holding   = { any: false, count: 0 }

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
        if(!holding[key]) holding.any = (holding.count += 1) > 0;
        keydown.any = true;
        keydown[key] = true;
        holding[key] = true;
        if(debugMode){
            console.log( "Keydown! key:"+key );
        }
    });

    canvas.addEventListener("keyup", function(e){
        var key = keycode(e.keyCode);
        holding.any = (holding.count -= 1) > 0;
        keyup.any = true;
        keyup[key] = true;
        holding[key] = false;
        if(debugMode){
            console.log( "Keyup! key:"+key );
        }
    });
};

IO.prototype.clearEvents = function(){
    this.clicked.x = null;
    this.clicked.y = null;
    this.mousedown.x = null;
    this.mousedown.y = null;
    this.mouseup.x = null;
    this.mouseup.y = null;
    for(var key in this.keydown){
        this.keydown[key] = false;
        this.keyup[key] = false;
    }
}

module.exports = IO;
},{"keycode":1}],7:[function(require,module,exports){
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

        if(paths.length === 0) return completeFunc();

        this.paths = paths;
        this.completeFunc = completeFunc;
        this.progressFunc = progressFunc;

        for(var i=0; i<paths.length; i++) {
            var path = paths[i];
            var ext = path.split('.').pop();

            if(['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
                this._loadImage(path);
            }
            if(['mp3', 'ogg', 'wav', 'midi'].includes(ext)) {
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
            this._loadFromAjax(path, function(data){
            instance._convertBinToBase64(data.response, function(base64) {
               audio.src = base64;
            });
        });
        audio.addEventListener('canplaythrough', function() {
            instance._loaded()
        });
        
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
    },
    _loadFromAjax: function (url, callback) {
        var xhr;
        
        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
            var versions = ["MSXML2.XmlHttp.5.0", 
                            "MSXML2.XmlHttp.4.0",
                            "MSXML2.XmlHttp.3.0", 
                            "MSXML2.XmlHttp.2.0",
                            "Microsoft.XmlHttp"]

            for(var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch(e){}
            } // end for
        }
        
        xhr.onreadystatechange = ensureReadiness;
        
        function ensureReadiness() {
            if(xhr.readyState < 4) {
                return;
            }
            
            if(xhr.status !== 200) {
                return;
            }

            // all is well  
            if(xhr.readyState === 4) {
                callback(xhr);
            }           
        }
        
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.send('');
    },
    _convertBinToBase64: function getData(audioFile, callback) {
        var reader = new FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(audioFile);
    }

}

module.exports = Loader;

},{}],8:[function(require,module,exports){
function Pen (ctx) {
    this.ctx = ctx;
    this.size = 1;
    this.color = 'black';
    this.fillColor = null;
    this.shapes = [];
}

Pen.prototype = {

    draw: function () {

        var s;
        var ctx = this.ctx;

        for(var i=0; i<this.shapes.length; i++) {
            
            s = this.shapes[i];
            ctx.lineWidth = s.size;
            ctx.strokeStyle = s.color;
            ctx.fillStyle = s.fillColor;

            ctx.beginPath();

            if (s.type == 'text') {
                ctx.textBaseline = "top";
                ctx.font = s.size + "px " + s.font;
                ctx.fillText(s.t, s.x, s.y);
            }
            else if (s.type == 'line') {
                ctx.moveTo(s.x1,s.y1);
                ctx.lineTo(s.x2,s.y2);
            }
            else if (s.type == 'circle') {
                ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
            }
            else if (s.type == 'triangle') {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
                ctx.lineTo(s.x3, s.y3);
            }
            else if (s.type == 'rect') {
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x + s.w, s.y);
                ctx.lineTo(s.x + s.w, s.y + s.h);
                ctx.lineTo(s.x, s.y + s.h);
            }
            else if (s.type == 'polygon') {
                ctx.moveTo(s.points[0],s.points[1]);
                for(var i=2; i<s.points.length; i+=2) {
                     ctx.lineTo(s.points[i],s.points[i+1]);
                }
            }

            ctx.closePath();

            if(s.size) ctx.stroke();
            if(s.fillColor) ctx.fill();
        }

        this.shapes = [];
    },

    drawText: function (text, x, y, font) {
        var s = {};
        s.t = text;
        s.x = x;
        s.y = y;
        s.font = font || 'Arial';
        s.type = 'text';
        this._addShape(s);
    },
    
    drawLine: function (x1, y1, x2, y2) {
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.type = 'line';
        this._addShape(s);
    },

    drawCircle: function (x, y ,r) {
        var s = {};
        s.x = x;
        s.y = y;
        s.r = r;
        s.type = 'circle';
        this._addShape(s);
    },

    drawTriangle: function (x1, y1, x2, y2, x3, y3) {
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.x3 = x3;
        s.y3 = y3;
        s.type = 'triangle';
        this._addShape(s);
    },

    drawRect: function (x, y, width, height) {
        var s = {};
        s.x = x;
        s.y = y;
        s.w = width;
        s.h = height;
        s.type = 'rect';
        this._addShape(s);
    },
    
    drawPolygon: function () {
        var s = {};
        s.points = Array.prototype.slice.call(arguments);
        s.type = 'polygon';
        this._addShape(s);
    },

    _addShape: function (s) {
        s.size = this.size;
        s.color = this.color;
        s.fillColor = this.fillColor;
        this.shapes.push(s);
    }

}

module.exports = Pen;
},{}],9:[function(require,module,exports){
var util = require("./util");

function Renderer(ctx, settings, images, debugMode){

    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
    // var stageWidth = settings.width,
    //     stageHeight = settings.height;

    var imageCache = images;

    var self = this;

    this.autoRender = false;

    this.clear = function() {
        ctx.clearRect(0,0,settings.width,settings.height);
    };

    this.drawSprites = function(sprites){
        sprites._sprites.sort(function(a, b){return a.layer-b.layer;}); // 針對 z-index 做排序，讓越大的排在越後面，可以繪製在最上層
        sprites.each(function(instance) {
            self.drawInstance(instance, ctx);
        });
    };

    this.drawInstance = function(instance, ctx){
        // console.log(instance);
        if(!instance.hidden){
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            var img = getImgFromCache(instance.getCurrentCostume());
            instance.width = img.width * instance.scale;
            instance.height = img.height * instance.scale;

            var rad = util.degreeToRad(instance.direction - 90);
            ctx.globalAlpha = instance.opacity;
            if (instance.rotationStyle === 'flipped') {
                if(instance.direction > 180) {
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
        } else if(src) {
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
},{"./util":13}],10:[function(require,module,exports){
function Sound (loader, debugMode){
    this.loader = loader;
    this.sounds = loader.sounds;
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
            // 用 preload 載入音檔 src 作為 cache
            this.loader.preload([url]);
            audio = this.sounds[url];
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
},{}],11:[function(require,module,exports){
var util = require("./util");
var hitCanvas = document.createElement('canvas'),
    hitTester = hitCanvas.getContext('2d');

function Sprite(args, eventList, settings, renderer) {

    if (args.constructor === String || args.constructor === Array) {
        args = { costumes: [].concat(args) }
    }

    this.x = util.isNumeric(args.x) ? args.x : settings.width/2;
    this.y = util.isNumeric(args.y) ? args.y : settings.height/2;
    this.width = 1;
    this.height = 1;
    this.direction = util.isNumeric(args.direction) ? args.direction : 90;
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

Sprite.prototype.moveTo = function(){
    if(util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)) {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
    } else if (util.isNumeric(arguments[0]) && util.isNumeric(arguments[1])) {
        this.x = arguments[0];
        this.y = arguments[1];
    } else {
        throw "請傳入角色(Sprite, Cursor)或是 X, Y 座標值"
    }
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

Sprite.prototype.edgeBounce = function () {
    if (this.x < 0) {
        this.x = 0;
        if (this.direction > 180 && this.direction > 0) {
            this.direction = -this.direction;
        }
    }
    if (this.x > this._settings.width) {
        this.x = this._settings.width;
        if (this.direction < 180) {
            this.direction = -this.direction;
        }
    }
    if (this.y < 0) {
        this.y = 0;
        if (this.direction < 90 || this.direction > 270) {
            this.direction = -this.direction + 180;
        }
    }
    if (this.y > this._settings.height) {
        this.y = this._settings.height;
        if (this.direction > 90 || this.direction < 270) {
            this.direction = -this.direction + 180;
        }
    }
}

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

Sprite.prototype.touched = function () {
    if (arguments[0].constructor === Array) {
        for(var i=0; i<arguments[0].length; i++){
            if (this._isTouched(arguments[0][i])){
                return true;
            }
        }
        return false;
    } else {
        return this._isTouched.apply(this, arguments);
    }
    
};

Sprite.prototype.distanceTo = function(){
    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
        return util.distanceBetween( this, arguments[0] );
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
    } else {
        throw "請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";
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
    } else if(["mousedown", "mouseup", "click"].includes(event)){
        return eventList.register(event, this, arguments[1]);
    } else if (event=="touch"){
        return eventList.register(event, this, arguments[1], arguments[2]);
    } else {
        console.log('Sprite.on() does only support "listen", "click" and "touch" events');
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

Sprite.prototype._isTouched = function () {

    // 自己或是對象狀態是隱藏或銷毀，則回傳 false
    if (this.hidden || this._deleted) return false;
    if (arguments[0] instanceof Sprite) {
        var target = arguments[0];
        if (target.hidden || target._deleted || target === this) return false;
    }

    // 由於效能考量，先用成本最小的「圓形範圍演算法」判斷是否有機會「像素重疊」
    var range = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
    if (arguments[0] instanceof Sprite) {
        range += Math.sqrt(Math.pow(target.width / 2, 2) + Math.pow(target.height / 2, 2));
    }
    if (this.distanceTo.apply(this, arguments) > range) {
        return false;
    }

    // 如果經過「圓形範圍演算法」判斷，兩者有機會重疊，則進一步使用「像素重疊演算法」進行判斷
    hitCanvas.width = this._settings.width;
    hitCanvas.height = this._settings.height;

    hitTester.globalCompositeOperation = 'source-over';
    if (arguments[0] instanceof Sprite){
        this._renderer.drawInstance(arguments[0], hitTester);
    } else if (util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)) {
        hitTester.fillRect(arguments[0].x,arguments[0].y,1,1);
    } else if (util.isNumeric(arguments[0]) && util.isNumeric(arguments[1])) {
        hitTester.fillRect(arguments[0],arguments[1],1,1);
    } else {
        throw "請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";
    }

    hitTester.globalCompositeOperation = 'source-in';
    this._renderer.drawInstance(this, hitTester);

    // 只要對 sprite 的大小範圍取樣即可，不需對整張 canvas 取樣
    var maxLength = Math.max(this.width, this.height); // 根據最大邊取得範圍 （因應圖片旋轉修正）
    var aData = hitTester.getImageData(this.x-maxLength/2, this.y-maxLength/2, maxLength, maxLength).data;
    var pxCount = aData.length;
    for (var i = 0; i < pxCount; i += 4) {
        if (aData[i+3] > 0) {
            return true;
        }
    }
    return false;
}

module.exports = Sprite;
},{"./util":13}],12:[function(require,module,exports){
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
},{}],13:[function(require,module,exports){
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
},{}]},{},[4])