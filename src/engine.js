var Sprite = require("./sprite");
var Sprites = require("./sprites");
var EventList = require("./event-list");
var Inspector = require("./inspector");
var Clock = require("./clock");

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
    var renderer = require("./renderer")(ctx, settings, sprites, debugMode);
    var clock = new Clock(function(){
        var start = (new Date()).getTime();
        settings.update();
        sprites.runTickFunc();
        sprites.removeDeletedSprites();
        eventList.traverse();
        inspector.updateFPS();
        var end = (new Date()).getTime();
        console.log(end-start);
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
        createSprite: function(args){ return new Sprite(args, eventList) }, // Pass io object into it because the sprite need to hear from events
        print: renderer.print,
        drawSprites: renderer.drawSprites,
        drawBackdrop: renderer.drawBackdrop,
        cursor: io.cursor,
        inspector: inspector,
        on: function(event, target, handler){ eventList.register(event, target, handler) },
        when: function(event, target, handler){ eventList.register(event, target, handler) },
        set: set,
        stop: function(){ clock.stop(); },
        start: function(){ clock.start(); },
        update: function(func){ settings.update=func; },
        forever: function(func){ settings.update=func; },
        always: function(func){ settings.update=func; },
        ctx: ctx,
        clear: renderer.clear,
        preloadImages: renderer.preload
    };
    return proxy;
}

window.Engine = engine;