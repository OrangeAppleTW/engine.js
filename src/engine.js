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

    //== Default params setting:
    debugMode  = debugMode||false;

    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");

    var hitCanvas = document.createElement('canvas');
    var hitTester = hitCanvas.getContext('2d');

    hitCanvas.width = canvas.width;
    hitCanvas.height = canvas.height;

    var settings = {
        width: canvas.width,
        height: canvas.height,
        zoom: 1,
        updateFunctions: [],
        fpsMax: 60
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
    var clock = new Clock(
        // onTick function
        function(){
            eventList.traverse();
            for(var i=0; i<settings.updateFunctions.length; i++){
                settings.updateFunctions[i]();
            };
            sprites.removeDeletedSprites();
            sprites.runOnTick();
            inspector.updateFPS();
        },
        // render function
        function(){
            if(autoRendering){
                renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
                pen.drawShapes();
                renderer.drawSprites(sprites);
                pen.drawTexts();
            }
        },
        // setting (for fpsMax)
        settings
    );

    // @TODO: 這麼做真的比較好嗎？還是能在 new Sprite 的時候加入就好 (Kevin 2018.10.22)
    Sprite.prototype._sprites = sprites;
    Sprite.prototype._eventList = eventList;
    Sprite.prototype._settings = settings;
    Sprite.prototype._renderer = renderer;
    Sprite.prototype._hitTester = hitTester;

    var background={
        path: "#ffffff"
    };    

    function set(args){
        if(args.width) hitCanvas.width = canvas.width = settings.width = args.width;
        if(args.height) hitCanvas.height = canvas.height = settings.height = args.height;
        if(args.zoom) {
            settings.zoom = args.zoom;
            canvas.style.width = canvas.width * settings.zoom + 'px';
            canvas.style.height = canvas.height * settings.zoom + 'px';
        }
        settings.update = args.update || settings.update;
        settings.fpsMax = args.fpsMax || settings.fpsMax;
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
            return new Sprite(args);
        },
        Sprite: Sprite,
        print: function(text, x, y, color ,size, font){ pen.print(text, x, y, color ,size, font) },
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
        },
        stopRendering: function(){ autoRendering=false; pen.drawingMode="instant"; },
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