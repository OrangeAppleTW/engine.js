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
        eventList.traverse();
        for(var i=0; i<settings.updateFunctions.length; i++){
            settings.updateFunctions[i]();
        };
        if(background.path){
            renderer.drawBackdrop(background.path, background.x, background.y, background.w, background.h);
        }
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

    function addPlugin(plugin) {
        var pluginName = plugin.name;
        if (!pluginName) throw '未設定 Plugin 名稱';
        if (!!this[pluginName]) throw '重複的 plugin 名稱';

        extendSprite = plugin.extendSprite;
        // 擴充 Sprite 屬性 / 方法
        if (!!extendSprite) {
            for(var key in extendSprite) {
                if (!!Sprite.prototype[key]) throw '重複的 extendSpirte 名稱';
                
                Sprite.prototype[key] = extendSprite[key];
            }
        }

        // 初始化 plugin
        this[pluginName] = {
            'sprites': sprites._sprites,
            'game': this
        };

        // 設定 plugin 資料
        var data = plugin.data;
        for(var key in data) {
            this[pluginName][key] = data[key];
        }

        // 設定 plugin 方法
        var methods = plugin.methods;
        for(var key in methods) {
            this[pluginName][key] = methods[key];
        }

        // 執行 init
        if (typeof plugin.init === 'function') {
            plugin.init.bind(this[pluginName])();
        }
    }

    var proxy = {
        createSprite: function(args){
            var newSprite = new Sprite(args, eventList, settings, renderer)
            sprites._sprites.push(newSprite);
            return newSprite;
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
        stop: function(){ clock.stop(); sound.stop(); },
        start: function(){ clock.start(); },
        forever: forever,
        update: forever,
        always: forever,
        clear: function(){ renderer.clear(); },
        preload: preload,
        sound: sound,
        broadcast: eventList.emit.bind(eventList),
        pen: pen,
        addPlugin: addPlugin
    };

    if(debugMode){
        proxy.eventList = eventList;
    }
    
    return proxy;
}

window.Engine = engine;