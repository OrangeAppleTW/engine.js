var costumesCache={},
    backdropCache={};

function Renderer(ctx, settings, sprites){

    var exports = {};
    var stageWidth = settings.width,
        stageHeight = settings.height;

    function clear() {
        ctx.clearRect(0,0,stageWidth,stageHeight);
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
                var img = costumesCache[instance.costumes[id]];
                // Solution A:
                // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
                if( !img ){
                    img=new Image();
                    img.src=instance.costumes[id];
                    costumesCache[instance.costumes[id]]=img;
                }
                instance.width = img.width;
                instance.height = img.height;
                // Solution B:
                // var img = new Image();
                // img.src=instance.costumes[0];
                ctx.drawImage( img, instance.x-img.width/2, instance.y-img.height/2 );
            }
        }
    }

    // @Params:
    // - src: backdrop image location
    // - options: {x:number, y:number, width:number, height:number}
    function drawBackdrop(src, x, y, width, height){
        if(src[0]=='#'){
            ctx.fillStyle=src;
            ctx.fillRect(0,0,stageWidth,stageHeight);
        } else {
            var img = costumesCache[src];
            // 如果已經預先 Cache 住，則使用 Cache 中的 DOM 物件，可大幅提升效能
            if( !img ){
                img=new Image();
                img.src=src;
                backdropCache[src]=img;
            }
            ctx.drawImage( img, x||0, y||0, width||img.width, height||img.height );
        }
    }

    exports.clear = clear;
    exports.print = print;
    exports.drawSprites = drawSprites;
    exports.drawBackdrop = drawBackdrop;

    return exports;
}

module.exports = Renderer;