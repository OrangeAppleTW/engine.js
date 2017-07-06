function EventList(io, debugMode){
    this.pool=[];
    this.messages = [];
    this.io=io;
    this.debugMode = debugMode || false;
}

EventList.prototype.traverse = function (){
    var pool = this.pool,
        io = this.io,
        messages = this.messages,
        debugMode = this.debugMode;
    for(var i=0; i<pool.length; i++){
        if (pool[i].sprite || pool[i].sprites) {
            var sprite = pool[i].sprite || pool[i].sprites[0];
            if (sprite.constructor.name=="Sprite" && sprite._deleted){ 
                pool.splice(i,1);
                continue;
            }
        }
        if      (pool[i].event=="click")        mouseJudger(   pool[i].sprite, pool[i].handler, io.clicked, debugMode);
        else if (pool[i].event=="mousedown")    mouseJudger(   pool[i].sprite, pool[i].handler, io.mousedown, debugMode);
        else if (pool[i].event=="mouseup")      mouseJudger(   pool[i].sprite, pool[i].handler, io.mouseup, debugMode);
        else if (pool[i].event=="keydown")      keyJudger(     pool[i].key,    pool[i].handler, io.keydown, debugMode);
        else if (pool[i].event=="keyup")        keyJudger(     pool[i].key,    pool[i].handler, io.keyup,   debugMode);
        else if (pool[i].event=="holding")      keyJudger(     pool[i].key,    pool[i].handler, io.holding, debugMode);
        else if (pool[i].event=="listen")       listenJudger(  pool[i].sprite, pool[i].handler, messages,   pool[i].message, debugMode);
        else if (pool[i].event=="touch")        touchJudger(   pool[i].sprite, pool[i].handler, pool[i].targets, debugMode );
    }
    io.clearEvents();
    this._clearMessages();
}

EventList.prototype._clearMessages = function () {
    this.messages = [];
}

EventList.prototype.clear = function(){
    this.pool=[];
}

EventList.prototype.register = function(){

    var event = arguments[0];
    var eventObj = {
        event: event,
        handler: arguments[arguments.length - 1]
    }

    if (event === "touch"){
        eventObj.sprite = arguments[1];
        if(arguments[2].constructor === Array) {
            eventObj.targets = arguments[2];
        } else {
            eventObj.targets = [arguments[2]];
        }
    } else if (["keydown", "keyup", "holding"].includes(event)){
       eventObj.key = arguments[1] || "any"; // 如果對象為 null 則為任意按鍵 "any"
    } else if (["mousedown", "mouseup", "click"].includes(event)) {
        if(arguments[1].constructor === Array) {
            eventObj.sprite = arguments[1];
        } else {
            eventObj.sprite = [arguments[1]];
        }
    } else if (event === "listen") {
        eventObj.message = arguments[1];
        eventObj.sprite = arguments[2];
    }

    this.pool.push(eventObj);
}

EventList.prototype.emit = function (eventName) {
    this.messages.push(eventName);
}

// 用來判斷 click, mousedown, mouseup 的 function
function mouseJudger(sprites, handler, mouse, debugMode){
    for(var i=0, sprite; sprite = sprites[i]; i++) {
        if(mouse.x && mouse.y){ // 如果有點擊記錄才檢查
            if(sprite){ // 如果是 Sprite, 則對其做判定
                if( sprite.touched(mouse.x,mouse.y) ){
                    handler.call(sprite);
                    if(debugMode){
                        console.log("Just fired a click handler on a sprite! ("+JSON.stringify(mouse)+")");
                    }
                }
            } else { // 如果為 null, 則對整個遊戲舞台做判定
                handler();
                if(debugMode){
                    console.log("Just fired a click handler on stage! ("+JSON.stringify(mouse)+")");
                }
            }
        }
    }
}

// 用來判斷 keydown, keyup, holding 的 function
function keyJudger(target, handler, keys, debugMode){
    if(keys[target]){
        handler();
        if(debugMode){
            console.log("Just fired a keydown handler on: "+key);
        }
    }
}

function listenJudger(sprite, handler, messages, message, debugMode) {
    if(messages.includes(message)) {
        handler.call(sprite);
        if(debugMode) {
            // console.log('listen event');
        }
    }
}

// @TODO: Now we could only detect Sprite instance, not include cursor.
function touchJudger(sprite, handler, targets, debugMode) {
    for(var i=0, target; target = targets[i]; i++) {
        if(sprite.touched(target)) {
            handler.call(sprite, target);
            if(debugMode) {
                console.log({event: "Touch", "sprite": sprite, "target": target});
            }
        }
    }
}

module.exports = EventList;