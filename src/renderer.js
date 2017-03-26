var util = require("./util");
var loader = new (require("../lib/pxloader-images"))();

function Renderer(ctx, settings, debugMode){

    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
    // var stageWidth = settings.width,
    //     stageHeight = settings.height;

    var imageCache = {};

    this.clear = function() {
        ctx.clearRect(0,0,settings.width,settings.height);
    };

    this.print = function(words, x, y, color, size, font) {
        x = x || 20;
        y = y || 20;
        size = size || 16; // Set or default
        font = font || "Arial";
        ctx.textBaseline = "top";
        ctx.font = (size*settings.zoom)+"px " + font;
        ctx.fillStyle = color || "black";
        ctx.fillText(words, x * settings.zoom, y * settings.zoom);
    };

    this.drawSprites = function(sprites){
        sprites.each(this.drawInstance);
    };

    this.drawInstance = function(instance){
        // console.log(instance);
        if(!instance.hidden){
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            var img = getImgFromCache(instance.getCurrentCostume());
            instance.width = img.width * instance.scale;
            instance.height = img.height * instance.scale;

            var rad = util.degreeToRad(instance.direction);
            ctx.scale(settings.zoom,settings.zoom);
            if (instance.rotationstyle === 'flip') {
                if(instance.direction%360 > 180) {
                    ctx.translate(instance.x*2, 0);
                    ctx.scale(-1, 1);
                    ctx.drawImage(  img,
                                    (instance.x-instance.width/2),
                                    (instance.y-instance.height/2),
                                    instance.width,
                                    instance.height
                    )
                    ctx.scale(-1, 1);
                    ctx.translate(-instance.x*2, 0);
                    ctx.scale(1/settings.zoom,1/settings.zoom);
                    return;
                } else {
                    var rad = 0;
                }
            }
            if(instance.rotationstyle === 'fixed') {
                var rad = 0;
            }
            ctx.translate(instance.x, instance.y);
            ctx.rotate(rad);
            ctx.drawImage( img,
                        (-instance.width / 2),
                        (-instance.height / 2),
                        instance.width,
                        instance.height
            );
            ctx.rotate(-rad);
            ctx.translate(-instance.x, -instance.y);
            ctx.scale(1/settings.zoom,1/settings.zoom);
        }
    };

    this.getImgFromCache = getImgFromCache;

    // @Params:
    // - src: backdrop image location
    // - options: {x:number, y:number, width:number, height:number}
    this.drawBackdrop = function(src, x, y, width, height){
        if(src[0]=='#'){
            ctx.fillStyle=src;
            ctx.fillRect(0,0,settings.width*settings.zoom,settings.height*settings.zoom);
        } else {
            var img = imageCache[src];
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            if( !img ){
                img=new Image();
                img.src=src;
                imageCache[src]=img;
            }
            ctx.drawImage(
                img,
                (x||0)*settings.zoom,
                (y||0)*settings.zoom,
                (width||img.width)*settings.zoom,
                (height||img.height)*settings.zoom
            );
        }
    };

    this.preload = function(images, completeFunc, progressFunc){
        var loaderProxy = {};
        if(images.length>0){
            if(completeFunc){
                onComplete(completeFunc);
            }
            if(progressFunc){
                onProgress(progressFunc);
            }
            for(var i=0; i<images.length; i++){
                var path = images[i];
                imageCache[path] = loader.addImage(path);
            }
            function onComplete(callback){
                loader.addCompletionListener(function(){
                    callback();
                });
            };
            function onProgress(callback){
                loader.addProgressListener(function(e) {
                    // e.completedCount, e.totalCount, e.resource.imageNumber
                    callback(e);
                });
            }
            loaderProxy.complete = onComplete;
            loaderProxy.progress = onProgress;
            loader.start();
            if(debugMode){
                console.log("Start loading "+images.length+" images...");
                loader.addProgressListener(function(e) {
                    console.log("Preloading progressing...");
                });
                loader.addCompletionListener(function(){
                    console.log("Preloading completed!");
                });
            }
        } else {
            if(completeFunc){
                completeFunc();
            }
        }
        return loaderProxy;
    };

    function getImgFromCache(path){
        var img = imageCache[path];
        if( !img ){
            img=new Image();
            img.src=path;
            imageCache[path]=img;
        }
        return img;
    }
}

module.exports = Renderer;