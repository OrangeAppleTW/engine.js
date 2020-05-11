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
    
    function gameloop () {
        // game logic
        eventList.traverse();
        for(var i=0; i<updateFunctions.length; i++){
            updateFunctions[i]();
        };
        sprites.removeDeletedSprites();
        sprites.runOnTick();
        inspector.updateFPS();

        // rendering
        if(settings.autoRendering){
            renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
            pen.drawShapes();
            renderer.drawSprites(sprites);
            pen.drawTexts();
        }
    }

    var clock = new Clock(gameloop);

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
        gameloop: gameloop, // to ensure the errors in gameloop can be caugth, expose it to brython to excute
    };
    if(settings.debugMode){
        proxy.eventList = eventList;
    }
    return proxy;
}

window.Engine = engine;