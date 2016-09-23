var loader = new (require("../lib/pxloader-images"))();
var imageCache={};

function Renderer(ctx, settings, sprites, debugMode){

    var exports = {};

    // 不可以這麼做，因為當我們要取 canvas 大小時，他可能已經變了
    // var stageWidth = settings.width,
    //     stageHeight = settings.height;

    function clear() {
        ctx.clearRect(0,0,settings.width,settings.height);
    }

    function print(words, x, y, color, size, font) {
        x = x || 20;
        y = y || 20;
        size = size || 16; // Set or default
        font = font || "Arial";
        ctx.font = size+"px " + font;
        ctx.fillStyle = color || "black";
        ctx.fillText(words,x,y);
    }

    function drawSprites(){
        sprites.each(drawInstance);
        function drawInstance(instance){
            if(!instance.hidden){
                var id = instance.currentCostumeId;
                var img = imageCache[instance.costumes[id]];
                // Solution A:
                // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
                if( !img ){
                    img=new Image();
                    img.src=instance.costumes[id];
                    imageCache[instance.costumes[id]]=img;
                }
                instance.width = img.width * instance.scale;
                instance.height = img.height * instance.scale;
                // Solution B:
                // var img = new Image();
                // img.src=instance.costumes[0];
                ctx.drawImage( img, instance.x-img.width/2, instance.y-img.height/2, instance.width*instance.scale, instance.height*instance.scale );
            }
        }
    }

    // @Params:
    // - src: backdrop image location
    // - options: {x:number, y:number, width:number, height:number}
    function drawBackdrop(src, x, y, width, height){
        if(src[0]=='#'){
            ctx.fillStyle=src;
            ctx.fillRect(0,0,settings.width,settings.height);
        } else {
            var img = imageCache[src];
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            if( !img ){
                img=new Image();
                img.src=src;
                imageCache[src]=img;
            }
            ctx.drawImage( img, x||0, y||0, width||img.width, height||img.height );
        }
    }

    function preload(images, completeFunc, progressFunc){
        var loaderProxy = {};
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
        return loaderProxy;
    }

    exports.clear = clear;
    exports.print = print;
    exports.drawSprites = drawSprites;
    exports.drawBackdrop = drawBackdrop;
    exports.preload = preload;

    return exports;
}

module.exports = Renderer;