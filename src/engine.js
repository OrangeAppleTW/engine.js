var Sprite = require("./sprite");
var Sprites = require("./sprites");
var EventList = require("./event-list");
var Inspector = require("./inspector");
var Clock = require("./clock");
var Renderer = require("./renderer");

function engine(stageId, debugMode){

    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");

    var settings = {
        width: canvas.width,
        height: canvas.height,
        // ratio: 1, //@TODO: set ratio
        // gravity: 0, //@TODO: set gravity
        update: function(){}
    };

    var sprites = new Sprites();
    var inspector = new Inspector();
    var io = require("./io")(canvas, debugMode);
    var eventList = new EventList(io, debugMode);
    var renderer = new Renderer(ctx, settings, debugMode);
    var clock = new Clock(function(){
        settings.update();
        sprites.runOnTick();
        sprites.removeDeletedSprites();
        eventList.traverse();
        inspector.updateFPS();
    });

    debugMode = debugMode || false;

    function set(args){
        if(args.width){canvas.width = args.width;}
        if(args.height){canvas.height = args.height;}
        settings.width      = args.width || settings.width;
        settings.height     = args.height || settings.height;
        settings.ratio      = args.ratio || settings.ratio;
        settings.gravity    = args.gravity || settings.gravity;
        settings.update     = args.update || settings.update;
        return this;
    }

    // function reset(){
    //     eventList.clear();
    //     sprites.clear();
    // }

    var proxy = {
        sprites: sprites,
        createSprite: function(args){ return new Sprite(args, eventList, settings) }, // Pass io object into it because the sprite need to hear from events
        print: renderer.print,
        drawSprites: function(){ renderer.drawSprites(sprites); },
        drawBackdrop: function(src, x, y, width, height){ renderer.drawBackdrop(src, x, y, width, height); },
        cursor: io.cursor,
        inspector: inspector,
        on: function(event, target, handler){ eventList.register(event, target, handler) },
        when: function(event, target, handler){ eventList.register(event, target, handler) },
        set: set,
        stop: function(){ clock.stop(); },
        start: function(){ clock.start(); },
        update: function(func){ settings.update=func; },
        ctx: ctx,
        clear: function(){ renderer.clear(); },
        preloadImages: function(imagePaths, completeCallback, progressCallback){ renderer.preload(imagePaths, completeCallback, progressCallback); }
    };
    return proxy;
}

window.Engine = engine;