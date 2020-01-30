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
function Clock (onTick, render) {

    var running = false;

    // Even the computer executes `stop`, the following instructions will still run. 
    // After that, we'll render the status after complete the tick, instead of the moment when we stop.
    // The reason why is that when the game is stopped, we still need to print the game scores or switch the costume of sprite to the game over,
    // but stop command may be executed in the forever loop or the event callback in onTick function,
    // So if we have to make sure that these things have to be done before the `stop`,
    // it will make designing games more complicated and difficult.
    function gameLoop () {
        if (running) {
            onTick();
            render();
        }
        requestAnimationFrame(gameLoop);
    };

    // when we create the game instance the game loop will start looping,
    // if we stop the game it just makes the game loop skip running game logic and rendering canvas
    gameLoop();

    this.start = function () {
        running = true;
    }

    this.stop = function () {
        running = false;
    }
}

module.exports = Clock;
},{}],3:[function(require,module,exports){
const VALID_EVENT_NAMES = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'holding', 'touch', 'hover'];

function EventList(io){
    this.pool = [];
    this.io = io;
}

EventList.prototype = {

    traverse: function (){

        var io = this.io;
        var self = this;
        this.pool.forEach(function (e) {
            if      (e.event === 'touch')     self.touchJudger( e.sprite, e.handler, e.targets);
            else if (e.event === 'click')     self.mouseJudger( e.sprite, e.handler, io.clicked);
            else if (e.event === 'hover')     self.hoverJudger( e.sprite, e.handler, io.cursor);
            else if (e.event === 'mousedown') self.mouseJudger( e.sprite, e.handler, io.mousedown);
            else if (e.event === 'mouseup')   self.mouseJudger( e.sprite, e.handler, io.mouseup);
            else if (e.event === 'holding')   self.keyJudger(   e.key,    e.handler, io.holding);
            else if (e.event === 'keyup')     self.keyJudger(   e.key,    e.handler, io.keyup);
            else if (e.event === 'keydown')   self.keyJudger(   e.key,    e.handler, io.keydown);
        });

        this.pool = this.pool.filter(function (e) {
            return !(e.sprite && e.sprite._deleted);
        });

        io.clearEvents();
    },

    register: function () {

        if (!this.validEventName(arguments[0])) return;

        var event = arguments[0];
        var eventObj = {
            event: event,
            handler: arguments[arguments.length - 1]
        }        

        if (event === 'touch'){
            eventObj.sprite = arguments[1];
            eventObj.targets = arguments[2] instanceof Array ? arguments[2] : [arguments[2]];
        }
        else if (event === 'hover') {
            eventObj.sprite = arguments[1] instanceof Array ? arguments[1] : [arguments[1]];
        }
        else if (['keydown', 'keyup', 'holding'].includes(event)){
            eventObj.key = arguments[1] instanceof Function ? 'any' : arguments[1];
        }
        else if (['mousedown', 'mouseup', 'click'].includes(event)) {
            if (arguments[1] instanceof Function) {
                eventObj.sprite = null;
            } else {
                eventObj.sprite = arguments[1] instanceof Array ? arguments[1] : [arguments[1]];
            }
        }
        else if (event === 'listen') {
            eventObj.message = arguments[1];
            eventObj.sprite = arguments[2];
        }

        this.pool.push(eventObj);
    },

    emit: function (eventName) {
        for(var i=0; i<this.pool.length; i++) {
            var e = this.pool[i];
            if(e.event == 'listen' && e.message == eventName) {
                e.handler.call(e.sprite);
            }
        }
    },

    mouseJudger: function (sprite, handler, mouse) {
        if (!mouse.x || !mouse.y) return; // 如果有點擊記錄才檢查
        if (sprite) {
            sprite.forEach(function (s) {
                if (s.touched(mouse.x, mouse.y)) {
                    handler.call(s);
                }
            });
        } else {
            handler();
        }
    },

    keyJudger: function(target, handler, keys) {
        if (keys[target]) handler();
    },

    touchJudger: function (sprite, handler, targets) {
        targets.forEach(function (t) {
            if (sprite.touched(t)) handler.call(sprite, t);
        });
    },

    hoverJudger: function (sprite, handler, cursor){
        sprite.forEach(function (s) {
            if (s.touched(cursor.x, cursor.y)) handler.call(s);
        });
    },

    validEventName: function (eventName) {
        if (VALID_EVENT_NAMES.includes(eventName) === false) {
            console.error('`' + eventName + '` 事件是不支援的，請檢查是否符合以下支援的事件\n ' +
            this.VALID_EVENT_NAMES.join(', '));
        }
        return true;
    },

    VALID_EVENT_NAMES: VALID_EVENT_NAMES,
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
var TouchSystem = require("./touch-system");

function engine(canvasId, debugMode){

    var canvas = document.getElementById(canvasId);
    var hitCanvas = document.createElement('canvas');
    hitCanvas.width = canvas.width;
    hitCanvas.height = canvas.height;

    var settings = {
        debugMode: debugMode || false,
        autoRendering: true,
        precision: 1, // 像素碰撞的精確度，單位是 pixel
    };

    var background = { path: '#ffffff' };
    var updateFunctions = [];

    var loader = new Loader();
    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = new IO(canvas, settings);
    var eventList = new EventList(io);
    var renderer = new Renderer(canvas, loader);
    var sound = new Sound(loader);
    var pen = new Pen(canvas, settings);
    var touchSystem = new TouchSystem(hitCanvas, loader, settings);
    var clock = new Clock(
        // onTick function
        function(){
            eventList.traverse();
            for(var i=0; i<updateFunctions.length; i++){
                updateFunctions[i]();
            };
            sprites.removeDeletedSprites();
            sprites.runOnTick();
            inspector.updateFPS();
        },
        // render function
        function(){
            if(settings.autoRendering){
                renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
                pen.drawShapes();
                renderer.drawSprites(sprites);
                pen.drawTexts();
            }
        }
    );  

    function set(args){
        if(args.width) canvas.width = args.width;
        if(args.height) canvas.height = args.height;
        if(args.precision) settings.precision = args.precision;
        if (args.precision || args.width || args.height) {
            hitCanvas.width = canvas.width / settings.precision;
            hitCanvas.height = canvas.height / settings.precision;    
        }
        if (args.autoRendering != undefined) settings.autoRendering = !!args.autoRendering;
    }

    function createSprite (args) {
        if (arguments.length > 1) args = Array.from(arguments);
        return new Sprite(args, eventList, renderer, loader, touchSystem, sprites);
    }

    function setBackground (path, x, y, w, h) {
        background.path = path;
        background.x = x;
        background.y = y;
        background.w = w;
        background.h = h;
    }

    function forever (func) {
        updateFunctions.push(func);
    }

    function stop () {
        clock.stop(); 
        sound.stop();
    }

    var proxy = {
        set: set,
        preload: loader.preload.bind(loader),
        start: clock.start.bind(clock),
        stop: stop,
        createSprite: createSprite,
        createSound: sound.play.bind(sound),
        setBackground: setBackground,
        setBackdrop: setBackground,
        inspector: inspector,
        forever: forever,
        update: forever,
        always: forever,
        sound: sound,
        cursor: io.cursor,
        key: io.holding,
        when: eventList.register.bind(eventList),
        on: eventList.register.bind(eventList),
        broadcast: eventList.emit.bind(eventList),
        pen: pen,
        print: pen.drawText.bind(pen),
        drawText: pen.drawText.bind(pen),
        drawBackdrop: renderer.drawBackdrop.bind(renderer),
        drawBackground: renderer.drawBackdrop.bind(renderer),
        drawSprites: renderer.drawSprites.bind(renderer),
        clear: renderer.clear.bind(renderer),
        Sprite: Sprite,
    };
    if(settings.debugMode){
        proxy.eventList = eventList;
    }
    return proxy;
}

window.Engine = engine;
},{"./clock":2,"./event-list":3,"./inspector":5,"./io":6,"./loader":7,"./pen":8,"./renderer":9,"./sound":11,"./sprite":12,"./sprites":13,"./touch-system":14}],5:[function(require,module,exports){
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

function IO(canvas, settings){

    var cursor    = this.cursor    = { x: 0, y: 0, isDown: false, left: false, right: false }
    var clicked   = this.clicked   = { x: null, y: null }
    var mousedown = this.mousedown = { x: null, y: null }
    var mouseup   = this.mouseup   = { x: null, y: null }
    var keyup     = this.keyup     = { any: false }
    var keydown   = this.keydown   = { any: false }
    var holding   = this.holding   = { any: false, count: 0 }
    
    // 遊戲場景響應式的縮放是交由外部 css 樣式來控制
    // zoom 表示遊戲場景的縮放比例，讓滑鼠事件或是觸控事件的觸發位置精準偵測
    // 因為沒有針對單一元素 resize 的事件，因此改每 100ms 偵測一次 canvas 的大小
    var zoomX = 1;
    var zoomY = 1;
    setInterval(function () {
        var box = canvas.getBoundingClientRect();
        zoomX = box.width/canvas.width;
        zoomY = box.height/canvas.height;
    }, 100);

    // 建立所有的按鍵並設為 false，避免 undefined 所造成的 exception
    for(var _key in keycode.codes){ holding[_key] = false; }

    var debugMode = !!settings.debugMode;

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
        mousedown.x = e.offsetX / zoomX;
        mousedown.y = e.offsetY / zoomY;
    });

    canvas.addEventListener("mouseup", function(e){
        if(e.which == 1) cursor.left = false;
        if(e.which == 3) cursor.right = false;
        cursor.isDown = cursor.left || cursor.right;
        mouseup.x = e.offsetX / zoomX;
        mouseup.y = e.offsetY / zoomY;
    });

    canvas.addEventListener("mousemove", function(e){
        cursor.x = e.offsetX / zoomX;
        cursor.y = e.offsetY / zoomY;
    });

    canvas.addEventListener("touchstart", function (e) {
        cursor.isDown = true;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mousedown.x = pos.x;
        cursor.y = mousedown.y = pos.y;
    });

    canvas.addEventListener("touchend", function (e) {
        cursor.isDown = false;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mouseup.x = pos.x;
        cursor.y = mouseup.y = pos.y;
    });

    canvas.addEventListener("touchmove", function (e) {
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = pos.x;
        cursor.y = pos.y;
    });

    function getTouchPos (touch) {
        return {
            x: (touch.pageX - canvas.offsetLeft) / zoomX,
            y: (touch.pageY - canvas.offsetTop) / zoomY
        }
    }

    canvas.addEventListener("click", function(e){
        clicked.x = e.offsetX / zoomX;
        clicked.y = e.offsetY / zoomY;
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
const DEFAULT_IMAGE = 'data:image/jpeg;base64,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';

function Loader () {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
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

    getImgFromCache: function (path) {
        var img = this.images[path];
        
        if (!img) {
            img = new Image();
            img.src = path;
            img.onerror = function (e) { 
                console.error(this.src.split('/').pop() + ' 素材載入失敗，請確認是否填寫正確！ \n 圖片路徑：' + this.src);
                img.src = DEFAULT_IMAGE;
            }
            this.images[path] = img;

        }
        return img;
    },

    _loadImage: function (path) {
        var instance = this;
        var image = new Image();
        image.src = path;
        image.crossOrigin = 'anonymous';
        image.onload = function() {instance._loaded()};
        image.onerror = function (e) { 
            console.error(this.src.split('/').pop() + ' 素材載入失敗，請確認是否填寫正確！ \n 圖片路徑：' + this.src);
            img.src = DEFAULT_IMAGE;
        }
        this.images[path] = image;
    },

    _loadSound: function (path) {
        var _this = this;
        this._xhrLoad(path, function(xhr){
            var data = xhr.response;

            _this.context.decodeAudioData(data, function(buffer) {
                _this.sounds[path] = buffer;    
                _this._loaded();
            }); 
        });
    },
    _loaded: function () {
        this.loaded += 1;
        if(this.progressFunc) {
            this.progressFunc(this.loaded, this.paths.length);
        }
        if(this.loaded >= this.paths.length && this.completeFunc) {
            this.completeFunc();
        }
    },
    _xhrLoad: function (url, onload) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            onload(xhr);
        };
        xhr.onerror = function () {
            console.error(xhr);
        };
        xhr.send();
    }

}

module.exports = Loader;

},{}],8:[function(require,module,exports){
function Pen (canvas, settings) {
    this.ctx = canvas.getContext('2d');
    this.size = 1;
    this.color = 'black';
    this.fillColor = null;
    this.settings = settings;
    this.shapes = [];
    this.texts = [];
}

Pen.prototype = {

    drawShapes: function () {

        var s;
        var ctx = this.ctx;

        for(var i=0; i<this.shapes.length; i++) {
            
            s = this.shapes[i];
            ctx.lineWidth = s.size;
            ctx.strokeStyle = s.color;
            ctx.fillStyle = s.fillColor;

            if (s.type == 'line') {
                this._drawLine(s.x1,s.y1,s.x2,s.y2);
            }
            else if (s.type == 'circle') {
                this._drawCircle(s.x, s.y, s.r);
            }
            else if (s.type == 'triangle') {
                this._drawTriangle(s.x1, s.y1, s.x2, s.y2, s.x3, s.y3);
            }
            else if (s.type == 'rect') {
                this._drawRect(s.x, s.y, s.w, s.h);
            }
            else if (s.type == 'polygon') {
                this._drawPolygon.apply(this, s.points);
            }
        }
        this.shapes=[];
    },

    drawTexts: function () {
        for(var i=0; i<this.texts.length; i++) {
            t = this.texts[i];
            this._drawText(t.text, t.x, t.y, t.color, t.size, t.font);
        }
        this.texts=[];
    },

    drawText: function (text, x, y, color ,size, font) {
        x = x == undefined ? 10 : x;
        y = y == undefined ? 10 : y;
        color = color || 'black';
        size = size || 16;
        font = font || 'Arial';

        // 如果不是 autoRender 模式，直接畫
        if (!this.settings.autoRendering) return this._drawText(text, x, y, color ,size, font);
        // 如果是 autoRener，存起來
        this._addText({
            text: text,
            x: x,
            y: y,
            color: color,
            size: size,
            font: font
        });
    },
    
    drawLine: function (x1, y1, x2, y2) {
        if (!this.settings.autoRendering) return this._drawLine(x1, y1, x2, y2);
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.type = 'line';
        this._addShape(s);
    },

    drawCircle: function (x, y ,r) {
        if (!this.settings.autoRendering) return this._drawCircle(x, y ,r);
        var s = {};
        s.x = x;
        s.y = y;
        s.r = r;
        s.type = 'circle';
        this._addShape(s);
    },

    drawTriangle: function (x1, y1, x2, y2, x3, y3) {
        if (!this.settings.autoRendering) return this._drawTriangle(x1, y1, x2, y2, x3, y3);
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
        if (!this.settings.autoRendering) return this._drawRect(x, y, width, height);
        var s = {};
        s.x = x;
        s.y = y;
        s.w = width;
        s.h = height;
        s.type = 'rect';
        this._addShape(s);
    },
    
    drawPolygon: function () {
        if (!this.settings.autoRendering) return this._drawPolygon.apply(this, arguments);
        var s = {};
        s.points = Array.prototype.slice.call(arguments);
        s.type = 'polygon';
        this._addShape(s);
    },

    _drawText: function (text, x, y, color ,size, font) {
        if(!this.settings.autoRendering) this._setPenAttr();
        this.ctx.textBaseline = "top";
        this.ctx.font = size + "px " + font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    },

    _drawLine: function (x1, y1, x2, y2) {
        if(!this.settings.autoRendering) this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawCircle: function (x, y ,r) {
        if(!this.settings.autoRendering) this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawTriangle: function (x1, y1, x2, y2, x3, y3) {
        if(!this.settings.autoRendering) this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawRect: function (x, y, w, h) {
        if(!this.settings.autoRendering) this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x+w, y);
        this.ctx.lineTo(x+w, y+h);
        this.ctx.lineTo(x, y+h);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawPolygon: function () {
        if(!this.settings.autoRendering) this._setPenAttr();
        var points = Array.prototype.slice.call(arguments);
        this.ctx.beginPath();
        this.ctx.moveTo(points[0],points[1]);
        for(var i=2; i<points.length; i+=2) {
                this.ctx.lineTo(points[i],points[i+1]);
        }
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _setPenAttr: function () {
        this.ctx.lineWidth = this.size;
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.fillColor;
    },

    _addShape: function (s) {
        s.size = this.size;
        s.color = this.color;
        s.fillColor = this.fillColor;
        this.shapes.push(s);
    },

    _addText: function (t) {
        this.texts.push(t);
    }

}

module.exports = Pen;
},{}],9:[function(require,module,exports){
var util = require("./util");

function Renderer (canvasEl, loader) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.loader = loader;
}

Renderer.prototype = {
    
    clear: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    drawSprites: function(sprites){
        sprites._sprites.sort(function (a, b) {
            return a.layer - b.layer;
        });
        var self = this;
        sprites.each(function (s) {
            self.drawInstance(s);
        });
    },

    drawInstance: function(sprite){

        if (sprite.hidden) return;

        var ctx = this.ctx;
        var img = sprite.getCostumeImage();
        var rad = util.degreeToRad(sprite.direction - 90);

        ctx.globalAlpha = sprite.opacity;
        if (sprite.rotationStyle === 'flipped') {
            if(sprite.direction > 180) {
                ctx.translate(sprite.x*2, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(  img,
                                (sprite.x-sprite.width/2),
                                (sprite.y-sprite.height/2),
                                sprite.width,
                                sprite.height
                )
                ctx.scale(-1, 1);
                ctx.translate(-sprite.x*2, 0);
                ctx.globalAlpha = 1;
                return;
            } else {
                var rad = 0;
            }
        }
        if(sprite.rotationStyle === 'fixed') {
            var rad = 0;
        }
        ctx.translate(sprite.x, sprite.y);
        ctx.rotate(rad);
        ctx.drawImage( img,
                    (-sprite.width / 2),
                    (-sprite.height / 2),
                    sprite.width,
                    sprite.height
        );
        ctx.rotate(-rad);
        ctx.translate(-sprite.x, -sprite.y);
        ctx.globalAlpha = 1;
    },

    drawBackdrop: function (src, x, y, width, height){
        if(src.includes('.')) {
            var img = this.loader.getImgFromCache(src);
            this.ctx.drawImage(img, (x||0), (y||0), (width||img.width), (height||img.height));
        } else if(src) {
            this.ctx.fillStyle = src;
            this.ctx.fillRect(0 ,0, this.canvas.width, this.canvas.height);
        }
    },
}

module.exports = Renderer;
},{"./util":15}],10:[function(require,module,exports){
function SoundNode(context) {
    this.source = null;
    this.gainNode = context.createGain();    
    this.context = context;
    
    this.isLoop = false;
    this.bufferData = null;
    this.volume = 1;

    // gainNode connect to context
    this.gainNode.connect(context.destination);
    
}

SoundNode.prototype = {
    setVolume: function(volume) {
        if (volume < 0) {
            return console.error("無效的音量值");
        }
        this.volume = volume;
        this.gainNode.gain.value = volume;
    },
    setBufferData: function(bufferData) {
        this.bufferData = bufferData;
    },
    setLoop: function (isLoop) {
        this.isLoop = isLoop;
    },
    mute: function(isMute) {
        if(isMute) {
            this.gainNode.gain.value = 0;
        } else {
            this.gainNode.gain.value = this.volume;
        }
    },
    pause: function() {
        this.source.playbackRate.value = Number.MIN_VALUE;        
    },
    resume: function () {
        this.source.playbackRate.value = 1;
    },
    play: function() {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.bufferData;
        this.source.loop = this.isLoop;
        this.source.connect(this.gainNode);
        this.source.start(0);
    },
    stop: function() {
        this.source.stop();
    }
}




module.exports = SoundNode;
},{}],11:[function(require,module,exports){
var SoundNode = require('./sound-node');

function Sound (loader) { 
    this.context = new (window.AudioContext || window.webkitAudioContext)();    
    this.soundNodes = [];
    
    this.loader = loader;
    this.sounds = loader.sounds;
    this.muted = false;
}

Sound.prototype = {
    play: function(url, isLoop) {
        isLoop = (typeof isLoop !== 'undefined') ?  isLoop : false;        
        var soundNode = new SoundNode(this.context);

        if(this.sounds[url]) {
            var bufferData = this.sounds[url];
            
            soundNode.setBufferData(bufferData);
            soundNode.setLoop(isLoop);

            this.soundNodes.push(soundNode);
            soundNode.play();            
        } else {
            var _this = this;
            this.loader._xhrLoad(url, function(xhr) {
                var data = xhr.response;
                _this.context.decodeAudioData(data, function(bufferData) {
                    // set cache
                    _this.sounds[url] = bufferData;    

                    // play sound
                    soundNode.setBufferData(bufferData);
                    soundNode.setLoop(isLoop);
                    _this.soundNodes.push(soundNode);
                    soundNode.play();
                }); 
            });
        }

        return soundNode;
    },
    setVolume: function(volume) {
        if (volume < 0) {
            return console.error("無效的音量值");
        }
        for(var i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.setVolume(volume);
        }
    },
    mute: function(isMute) {
        for(var i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.mute(isMute);
        }
    },
    pause: function() {
        this.context.suspend();
    },
    resume: function() {
        this.context.resume();
    },
    stop: function() {
        for(var i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.stop();
        }
    }
}

module.exports = Sound;
},{"./sound-node":10}],12:[function(require,module,exports){
var util = require('./util');

function Sprite(args, eventList, renderer, loader, touchSystem, sprites) {

    if (args.constructor === String || args.constructor === Array) {
        args = { costumes: [].concat(args) }
    }

    this.x = util.isNumeric(args.x) ? args.x : renderer.canvas.width/2;
    this.y = util.isNumeric(args.y) ? args.y : renderer.canvas.height/2;
    this.direction = util.isNumeric(args.direction) ? args.direction : 90;
    this.scale = util.isNumeric(args.scale) ? args.scale : 1;
    this.layer = util.isNumeric(args.layer) ? args.layer : 0;
    this.opacity = util.isNumeric(args.opacity) ? args.opacity : 1;
    this.costumeId = util.isNumeric(args.costumeId) ? args.costumeId : 0;
    this.costumes = [].concat(args.costumes); // Deal with single string
    this.hidden = !!args.hidden; // change to boolean
    this.rotationStyle = ['full','flipped','fixed'].includes(args.rotationStyle) ? args.rotationStyle : 'full'; 
    this.width = 1;
    this.height = 1;

    this._onTickFuncs = [];
    this._deleted = false;
    this._animation = { frames: [], rate: 5, timer: 0 }

    this._eventList = eventList;
    this._renderer = renderer;
    this._loader = loader;
    this._touchSystem = touchSystem;

    sprites._sprites.push(this);
}

Sprite.prototype = {

    stepForward: function (distance) {
        var rad = util.degreeToRad(this.direction);
        this.x += Math.sin(rad)*distance;
        this.y -= Math.cos(rad)*distance;
    },

    moveTo: function () {
        var pos = util.position(arguments);
        this.x = pos.x;
        this.y = pos.y;
    },

    move: function (x, y) {
        this.x += x;
        this.y += y;
    },

    toward: function () {
        var target = util.position(arguments);
        this.direction = util.vectorToDegree(target.x - this.x,  target.y - this.y);
    },

    touched: function () {
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
    },

    distanceTo: function () {
        var pos = util.position(arguments);
        return util.distanceBetween(this.x, this.y, pos.x, pos.y);
    },

    forever: function (func) {
        this._onTickFuncs.push(func);
    },

    on: function () {
        var eventName = arguments[0];
        var eventList = this._eventList;

        if (!eventList.validEventName(eventName)) return;

        if (eventName === 'touch') {
            return eventList.register(eventName, this, arguments[1], arguments[2]);
        }
        if (['mousedown', 'mouseup', 'click', 'hover'].includes(eventName)) {
            return eventList.register(eventName, this, arguments[1]);
        }
        if (['keydown', 'keydup', 'holding'].includes(eventName)) {
            return eventList.register(eventName, arguments[1], arguments[2]);
        }
        if (eventName === 'listen') {
            return eventList.register(eventName, arguments[1], this, arguments[2]);
        }
    },

    destroy: function(){
        this._deleted = true;
    },

    nextCostume: function () {
        this.costumeId += 1;
        if(this.costumeId >= this.costumes.length) {
            this.costumeId = 0;
        }
    },

    bounceEdge: function () {
        var stage = this._renderer.canvas;
        if (this.x < 0) {
            this.x = 0;
            if (this.direction > 180 && this.direction > 0) {
                this.direction = -this.direction;
            }
        }
        else if (this.x > stage.width) {
            this.x = stage.width;
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
        else if (this.y > stage.height) {
            this.y = stage.height;
            if (this.direction > 90 || this.direction < 270) {
                this.direction = -this.direction + 180;
            }
        }
    },

    animate: function (frames, frameRate, callback) {
        this._animation = {
            frames: frames,
            rate: frameRate || 5,
            callback: callback,
            timer: 0
        }
    },

    getCostumeImage: function () {
        var id = this.costumes[this.costumeId];
        return this._loader.getImgFromCache(id);
    },

    update: function () {
        this._updateDirection();
        this._updateSize();
        this._updateFrames();
        for (var i=0; i < this._onTickFuncs.length; i++) {
            this._onTickFuncs[i].call(this);
        }
    },

    _updateDirection: function () {
        this.direction = this.direction % 360;
        if(this.direction < 0) this.direction += 360;
    },

    _updateSize: function () {
        var img = this.getCostumeImage();
        this.width = img.width * this.scale;
        this.height = img.height * this.scale;
    },

    _updateFrames: function () {
        var animate = this._animation;
        if(animate.frames.length > 0) {
            var now = new Date().getTime();
            if(now >= animate.timer + 1000 / animate.rate) {
                animate.timer = now;
                this.costumeId = animate.frames.shift();
                if(animate.frames.length <= 0 && animate.callback) animate.callback();
            }
        }
    },

    _isTouched: function () {
        if (arguments[0] instanceof Sprite) {
            return this._touchSystem.isTouch(this, arguments[0]);
        }
        var pos = util.position(arguments);
        return this._touchSystem.isTouchDot(this, pos.x, pos.y);
    },
}

Sprite.prototype.when = Sprite.prototype.on;
Sprite.prototype.always = Sprite.prototype.forever;

module.exports = Sprite;
},{"./util":15}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
var util = require("./util");
var Sprite = require('./sprite');
var Renderer = require('./renderer');

function TouchSystem(canvas, loader, settings) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.renderer = new Renderer(canvas, loader, settings);
    this.settings = settings;
}

TouchSystem.prototype = {

    isTouchDot: function (sprite, x, y) {
        return this.isTouch(sprite, {
            x: x,
            y: y,
            width: this.settings.precision*2,
            height: this.settings.precision*2,
            direction: 0,
            area: 1,
        });
    },

    isTouch: function (spriteA, spriteB) {

        if (spriteA.hidden || spriteA._deleted ||
            spriteB.hidden || spriteB._deleted ||
            spriteA === spriteB) return false;

        var boxA = this.getBoxOf(spriteA);
        var boxB = this.getBoxOf(spriteB);

        if (this.AABBJudger(boxA, boxB) === false) return false;
        
        var undoA = this.reduceAccuracy(spriteA);
        var undoB = this.reduceAccuracy(spriteB);

        var box = boxA.area < boxB.area ? boxA : boxB;
        this.reduceAccuracy(box);
        result = this.pixelJudger(spriteA, spriteB, box);

        undoA();
        undoB();

        return result;
    },

    getBoxOf: function (sprite) {

        var box = { x: sprite.x, y: sprite.y, area: sprite.width*sprite.height }

        if (sprite.direction === 90 || sprite.direction === 270 || sprite.rotationStyle !== 'full') {
            box.width = sprite.width;
            box.height = sprite.height;
            return box;
        }
        if (sprite.direction === 0 || sprite.direction === 180 ) {
            box.width = sprite.height;
            box.height = sprite.width;
            return box;
        }

        var length = Math.sqrt(sprite.width * sprite.width + sprite.height * sprite.height);
        var angle = Math.asin(sprite.width / length);
        var a1 = util.degreeToRad(sprite.direction) - angle;
        var a2 = util.degreeToRad(sprite.direction) + angle;

        var a1y = Math.abs(Math.sin(a1));
        var a1x = Math.abs(Math.cos(a1));
        var a2y = Math.abs(Math.sin(a2));
        var a2x = Math.abs(Math.cos(a2));

        box.width = Math.max(a1x, a2x)*length;
        box.height = Math.max(a1y, a2y)*length;
        box.area = box.width*box.height;
        return box;
    },

    AABBJudger: function (boxA, boxB) {
        return Math.abs(boxA.x - boxB.x) < (boxA.width + boxB.width) / 2 &&
               Math.abs(boxA.y - boxB.y) < (boxA.height + boxB.height) / 2
    },

    pixelJudger: function (spriteA, spriteB, box) {

        if (box.width < 1 || box.height < 1) return false;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.globalCompositeOperation = 'source-over';
        this.renderer.drawInstance(spriteA);

        this.ctx.globalCompositeOperation = 'source-in';
        if (spriteB instanceof Sprite) {
            this.renderer.drawInstance(spriteB);
        } else {
            this.ctx.fillRect(spriteB.x, spriteB.y, 1, 1);
        }

        var aData = this.ctx.getImageData(box.x - box.width/2, box.y - box.height/2, box.width, box.height).data;
        for (var i = 0; i < aData.length; i += 4) {
            if (aData[i + 3] > 0) return true;
        }
        return false;
    },

    reduceAccuracy: function (s) {
        var rate = this.settings.precision;
        var x = s.x;
        var y = s.y;
        var width = s.width;
        var height = s.height;
        var scale = s.scale;
        s.x /= rate;
        s.y /= rate;
        s.width /= rate;
        s.height /= rate;
        s.scale /= rate;
        return function () {
            s.x = x;
            s.y = y;
            s.width = width;
            s.height = height;
            s.scale = scale;
        }
    },
}

module.exports = TouchSystem;
},{"./renderer":9,"./sprite":12,"./util":15}],15:[function(require,module,exports){
var util = {

    isNumeric: function(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    radToDegree: function(rad){
        rad = rad%(Math.PI*2);
        if(rad<0) rad += Math.PI*2;
        return rad*180/Math.PI;
    },

    degreeToRad: function(degree){
        degree = degree%360;
        if(degree<0) degree += 360;
        return degree/180*Math.PI;
    },
    
    distanceBetween: function(fromX, fromY, toX, toY){
        return Math.sqrt(Math.pow(fromX-toX, 2) + Math.pow(fromY-toY, 2));
    },

    vectorToDegree: function (vectorX, vectorY) {
        var rad = Math.atan2(vectorX, -vectorY); // 這裡的 vectorY 和數學坐標是反過來的
        return this.radToDegree(rad)
    },

    position: function (args) {
        if(this.isNumeric(args[0].x) && this.isNumeric(args[0].y)) {
            return args[0];
        } else if (this.isNumeric(args[0]) && this.isNumeric(args[1])) {
            return { x: args[0], y: args[1] }
        } else {
            throw "請傳入角色(Sprite, Cursor)或是 X, Y 座標值"
        }
    }
};


module.exports = util;
},{}]},{},[4])