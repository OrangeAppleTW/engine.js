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


function Clock( onTick, render ){
    this._state = "readyToStart"; //"readyToStart", "stopping", "running";
    this._onTick = onTick;
    this._render = render;
}

Clock.prototype.start = function(){
    if(this._state==="readyToStart"){
        var onTick;
        this._state = "running";
        onTick = (function(){
            if(this._state==="running"){
                this._onTick();
                if(this._state!="stopping") this._render();
                requestAnimationFrame(onTick);
            } else {
                this._state = "readyToStart";
            }
        }).bind(this);
        setTimeout( onTick, 0 ); // 必須 Async，否則會產生微妙的時間差
    } else if (this._state==="stopping") {
        setTimeout( start, 10 );
    }
}

Clock.prototype.stop = function(){
    if(this._state==="running" || this._state==="readyToStart"){
        this._state = "stopping";
        this._render();
    }
}

module.exports = Clock;