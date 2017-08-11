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
            pen.clear();
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
        Sprite: function(args) {
            return proxy.createSprite(args);
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
        stopRendering: function(){ autoRendering=false; pen.autoRender=false; },
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