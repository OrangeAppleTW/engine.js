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

    //== Default params setting:
    debugMode  = debugMode||false;

    var canvas = document.getElementById(canvasId);
    var hitCanvas = document.createElement('canvas');

    var settings = {
        width: canvas.width,
        height: canvas.height,
        updateFunctions: [],
        precision: 1, // 像素碰撞的精確度，單位是 pixel
    };

    hitCanvas.width = canvas.width / settings.precision;
    hitCanvas.height = canvas.height / settings.precision;

    var autoRendering = true;

    var loader = new Loader();
    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = new IO(canvas, settings, debugMode);
    var eventList = new EventList(io, debugMode);
    var renderer = new Renderer(canvas, loader, settings);
    var sound = new Sound(loader, debugMode);
    var pen = new Pen(canvas);
    var touchSystem = new TouchSystem(hitCanvas, loader, settings);
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
        }
    );

    var background={
        path: "#ffffff"
    };    

    function set(args){
        if(args.precision) settings.precision = args.precision;
        if(args.width) canvas.width = settings.width = args.width;
        if(args.height) canvas.height = settings.height = args.height;
        if (args.precision || args.width || args.height) {
            hitCanvas.width = canvas.width / settings.precision;
            hitCanvas.height = canvas.height / settings.precision;    
        }
        settings.update = args.update || settings.update;
        return this;
    }

    function createSprite (args) {
        return new Sprite(args, eventList, renderer, loader, touchSystem, settings, sprites);
    }

    // for proxy.setBackdrop, setBackground
    function setBackground (path, x, y, w, h) {
        background.path = path;
        background.x = x;
        background.y = y;
        background.w = w;
        background.h = h;
    }

    function forever (func) {
        settings.updateFunctions.push(func);
    }

    function preload (assets, completeFunc, progressFunc) {
        loader.preload(assets, completeFunc, progressFunc);
    }

    function drawText (text, x, y, color ,size, font) {
        pen.drawText(text, x, y, color ,size, font);
    }

    function stop () {
        clock.stop(); 
        sound.stop();
    }

    function stopRendering () {
        autoRendering = false;
        pen.drawingMode = 'instant';
    }

    var proxy = {
        createSprite: createSprite,
        Sprite: Sprite,
        print: drawText,
        drawText: drawText,
        setBackground: setBackground,
        setBackdrop: setBackground,
        cursor: io.cursor,
        key: io.holding,
        inspector: inspector,
        when: eventList.register.bind(eventList),
        on: eventList.register.bind(eventList),
        set: set,
        stop: stop,
        stopRendering: stopRendering,
        start: clock.start.bind(clock),
        forever: forever,
        update: forever,
        always: forever,
        clear: renderer.clear.bind(renderer),
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