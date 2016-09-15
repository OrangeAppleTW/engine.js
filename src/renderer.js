//  state 用來表達 renderer 的以下狀態：
//
//   1. readyToStart:
//      初始狀態，此時執行 startRendering 會直接開始 rendering，並將狀態切換為 "running"。
//   2. running:
//      不停 Rendering，此時可執行 stop 將狀態切換為 "stopping"。
//      但是執行 startRendering 則不會有任何反應
//      執行 stop 則不會有任何反應。
//   3. stopping:
//      此時雖然已接受到停止訊息，但是最後一次的 rendering 尚未結束，
//      因此若在此時執行 startRendering，會每隔一小段時間檢查 state 是否回復到 "readyToStart"。
//
//  狀態變化流程如下：
//  (1) -> (2) -> (3) -> (1)

var FPS = 60,
    costumesCache={},
    backdropCache={},
    state="readyToStart"; //"readyToStart", "stopping", "running";

function Renderer(ctx, stageWidth, stageHeight, frameFunc, sprites, eventList, inspector){

    var exports = {};

    if(frameFunc){
        startRendering(frameFunc);
    }

    function print(words, x, y, color, size, font) {
        var size = size || 16; // Set or default
        var font = font || "Arial";
        ctx.font = size+"px " + font;
        ctx.fillStyle = color || "black";
        ctx.fillText(words,x,y);
    }

    function drawSprites(){
        for(let key in sprites){
            if (sprites[key].constructor.name === "Sprite") {
                drawInstance(sprites[key]);
            } else if (sprites[key] instanceof Array) {
                var instances = sprites[key];
                for(let i=0; i<instances.length; i++){
                    var instance = instances[i];
                    drawInstance(instance);
                }
            }
        }
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

    // @TODO: 型別檢測
    function drawBackdrop(src){
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
            ctx.drawImage( img, 0, 0 )
        }
    }

    function setFrameFunc(func) {
        frameFunc = func;
    }

    function startRendering(){
        if(state==="readyToStart"){
            state = "running";
            var draw = function(){
                if(state==="running"){
                    ctx.clearRect(0,0,stageWidth,stageHeight);

                    frameFunc(); // 放在 clear 後面，才能讓使用者自行在 canvas 上畫東西

                    eventList.traverse();

                    inspector.updateFPS();
                    setTimeout(function(){
                        requestAnimationFrame(draw);
                    },1000/FPS);
                } else {
                    state = "readyToStart";
                }
            }
            setTimeout( draw, 0 ); // 必須 Async，否則會產生微妙的時間差
        } else if (state==="stopping") {
            setTimeout( startRendering, 10 );
        }
    }

    function stop(){
        if(state==="running"){
            state = "stopping";
        }
    }

    exports.print = print;
    exports.drawSprites = drawSprites;
    exports.drawBackdrop = drawBackdrop;
    exports.startRendering = startRendering;
    exports.stop = stop;
    exports.setFrameFunc = setFrameFunc;

    return exports;
}

module.exports = Renderer;