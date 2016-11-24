var Sprite = require("./sprite");
var Sprites = require("./sprites");
var EventList = require("./event-list");
var Inspector = require("./inspector");
var Clock = require("./clock");
var Renderer = require("./renderer");
var Sound = require("./sound");

function engine(stageId, debugMode){

    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");

    var settings = {
        width: canvas.width,
        height: canvas.height,
        zoom: 1,
        // gravity: 0, //@TODO: set gravity
        update: function(){}
    };

    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = require("./io")(canvas, settings, debugMode);
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
        settings.zoom      = args.zoom || settings.zoom;
        settings.width      = args.width || settings.width;
        settings.height     = args.height || settings.height;
        settings.gravity    = args.gravity || settings.gravity;
        settings.update     = args.update || settings.update;
        if(args.width || args.zoom){ canvas.width = settings.width*settings.zoom;}
        if(args.height || args.zoom){ canvas.height = settings.height*settings.zoom;}
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