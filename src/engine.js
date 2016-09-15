/**
 * Whether the environment is a WebWorker.
 * @const{boolean}
 */
// var ENV_WORKER = typeof importScripts === 'function';

function engine(stageId, debugMode , frameFunc){
    var Sprite = require("./sprite");
    var Sprites = require("./sprites");
    var inspector = require("./inspector");
    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");
    var sprites = new Sprites();
    var settings = {
        width: canvas.width,
        height: canvas.height,
        // ratio: 1, //@TODO: set ratio
        // gravity: 0, //@TODO: set gravity
        frameFunc: function(){}
    };

    debugMode = debugMode || false;

    var io = require("./io")(canvas, debugMode);
    var eventList = require("./event-list")(io, debugMode);
    var renderer = require("./renderer")(ctx, settings, sprites, eventList, inspector);

    function set(args){
        if(args.width){canvas.width = args.width;}
        if(args.height){canvas.height = args.height;}
        settings.width      = args.width || settings.width;
        settings.height     = args.height || settings.height;
        settings.ratio      = args.ratio || settings.ratio;
        settings.gravity    = args.gravity || settings.gravity;
        settings.frameFunc  = args.frameFunc || settings.frameFunc;
        return this;
    }

    // function reset(){
    //     eventList.clear();
    //     sprites.clear();
    // }

    var proxy = {
        sprites: sprites,
        createSprite: Sprite.new,
        print: renderer.print,
        drawSprites: renderer.drawSprites,
        drawBackdrop: renderer.drawBackdrop,
        cursor: io.cursor,
        inspector: inspector,
        on: eventList.register,
        set: set,
        stop: renderer.stop,
        start: renderer.startRendering,
        setFrameFunc: function(func){ set({frameFunc:func}) },
        ctx: ctx
    };
    return proxy;
}

// if(ENV_WORKER){
//     onmessage = function(e){
//         var message = e.data[0],
//             data = e.data[1];
//         switch(message){
//             case ""
//         }
//     }
// }

window.Engine = engine;