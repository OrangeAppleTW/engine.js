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

    var loader = new Loader();
    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = new IO(canvas, settings, debugMode);
    var eventList = new EventList(io, debugMode);
    var renderer = new Renderer(ctx, settings, loader.images, debugMode);
    var sound = new Sound(loader.sounds, debugMode);
    var pen = new Pen(ctx);
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
        pen.draw();
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
        print: function(text, x, y, color ,size, font) {pen.drawText(text, x, y, color ,size, font)},
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
        pen: pen,

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