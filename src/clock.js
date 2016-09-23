//  state 用來表達 renderer 的以下狀態：
//
//   1. readyToStart:
//      初始狀態，此時執行 start 會直接開始 cycling(不斷執行 draw)，並將狀態切換為 "running"。
//   2. running:
//      不停 cycling，此時可執行 stop 將狀態切換為 "stopping"。
//      但是執行 start 則不會有任何反應
//      執行 stop 則不會有任何反應。
//   3. stopping:
//      此時雖然已接受到停止訊息，但是最後一次的 rendering 尚未結束，
//      因此若在此時執行 start，會每隔一小段時間檢查 state 是否回復到 "readyToStart"。
//
//  狀態變化流程如下：
//  (1) -> (2) -> (3) -> (1)

var FPS = 60

function Clock(settings, eventList, sprites, inspector){

    var state="readyToStart"; //"readyToStart", "stopping", "running";

    function start(){
        if(state==="readyToStart"){
            state = "running";
            var draw = function(){
                if(state==="running"){
                    sprites.runTickFunc();
                    settings.frameFunc();
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
            setTimeout( start, 10 );
        }
    }

    function stop(){
        if(state==="running"){
            state = "stopping";
        }
    }

    exports.start = start;
    exports.stop = stop;

    return exports;
}

module.exports = Clock;