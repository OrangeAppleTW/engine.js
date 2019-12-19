//  state 用來表達 renderer 的以下狀態：
//
//   1. readyToStart:
//      初始狀態，此時執行 start 會直接開始 cycling(不斷執行 onTick)，並將狀態切換為 "running"。
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


function Clock( onTick, render, settings ){
    this._state = "readyToStart"; //"readyToStart", "stopping", "running";
    this._onTick = onTick;
    this._render = render;

    this.start = function(){
        if(this._state==="readyToStart"){
            var onTick;
            var lastTickTime = (new Date()).getTime(); // For limiting the FPS

            this._state = "running";

            onTick = (function(){
                if(this._state==="running"){
                    var now = new Date().getTime(),
                        delta = now - lastTickTime,
                        interval = 1000/settings.fpsMax;
                    if (delta > interval) {
                        // Even the computer executes `stop`, the following instructions will still run. 
                        // After that, we'll render the status after complete the tick, instead of the moment when we stop.
                        // The reason why is that when the game is stopped, we still need to print the game scores or switch the costume of sprite to the game over,
                        // but stop command may be executed in the forever loop or the event callback in onTick function,
                        // So if we have to make sure that these things have to be done before the `stop`,
                        // it will make designing games more complicated and difficult.
                        this._onTick();
                        this._render();

                        lastTickTime = now - (delta % interval);
                    }
                    requestAnimationFrame(onTick);
                } else {
                    this._state = "readyToStart";
                }
            }).bind(this);
            setTimeout( onTick, 0 ); // 必須 Async，否則會產生微妙的時間差
        } else if (this._state==="stopping") {
            setTimeout( start, 10 );
        }
    };

    this.stop = function(){
        if(this._state==="running" || this._state==="readyToStart"){
            this._state = "stopping";
        }
    }
}

module.exports = Clock;