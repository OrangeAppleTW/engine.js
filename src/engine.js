/**
 * Whether the environment is a WebWorker.
 * @const{boolean}
 */
// var ENV_WORKER = typeof importScripts === 'function';

function engine(stageId, frameFunc, stageWidth, stageHeight){
    var Sprite = require("./sprite");
    var inspector = require("./inspector");
    var canvas= document.getElementById(stageId);
    var ctx = canvas.getContext("2d");
    var sprites = {};

    stageWidth = stageWidth || canvas.width;
    stageHeight = stageHeight || canvas.height;

    var io = require("./io")(canvas);
    var eventList = require("./event-list")(io);
    var renderer = require("./renderer")(ctx, stageWidth, stageHeight, frameFunc, sprites, eventList, inspector);

    // @TODO: Stop 的時候clear sprites
    function stop(){
        eventList.clear();
        renderer.stop();
    }

    // @TODO: Clear all sprites
    var proxy = {
        sprites: sprites,
        createSprite: Sprite.new,
        print: renderer.print,
        drawSprites: renderer.drawSprites,
        drawBackdrop: renderer.drawBackdrop,
        cursor: io.cursor,
        inspector: inspector,
        on: eventList.register,
        //@TODO: set ratio
        //@TODO: set gravity
        set: function(){},
        stop: stop,
        start: renderer.startRendering,
        // @TODO: merge into set
        setFrameFunc: renderer.setFrameFunc,
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