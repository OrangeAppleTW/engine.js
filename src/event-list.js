function EventList(io, debugMode){
    this.pool=[];
    this.io=io;
    this.debugMode = debugMode || false;
}

EventList.prototype.traverse = function (){
    var pool = this.pool,
        io = this.io,
        debugMode = this.debugMode;
    for(var i=0; i<pool.length; i++){
        if (pool[i].sprite || pool[i].sprites) {
            var sprite = pool[i].sprite || pool[i].sprites[0];
            if (sprite.constructor.name=="Sprite" && sprite._deleted){ 
                pool.splice(i,1);
                continue;
            }
        }
        if (pool[i].event=="hover")    { hoverJudger(   pool[i].sprite,  pool[i].handler, io.cursor,  debugMode ); }
        else if (pool[i].event=="click")    { clickJudger(   pool[i].sprite,  pool[i].handler, io.clicked, debugMode ); }
        else if (pool[i].event=="keydown")  { keydownJudger( pool[i].key,     pool[i].handler, io.keydown, debugMode ); }
        else if (pool[i].event=="keyup")    { keydownJudger( pool[i].key,     pool[i].handler, io.keyup,   debugMode ); }
        else if (pool[i].event=="holding")  { holdingJudger( pool[i].key,     pool[i].handler, io.holding, debugMode ); }
        else if (pool[i].event=="touch")    {
            if(!pool[i].sprites.length || pool[i].sprites.length<2){
                console.log("You must pass a sprites array which length is bigger than 1 as the second argument!");
                return;
            }
            touchJudger( pool[i].sprites, pool[i].handler, debugMode );
        }
    }
    clearEventRecord(this.io);
}

EventList.prototype.clear = function(){
    this.pool=[];
}

EventList.prototype.register = function(event, target, handler){
    var eventObj = {
        event:event,
        handler:handler
    }
    // @TODO: target 型別偵測
    if (event=="touch"){
        eventObj.sprites = target;
    } else if (event=="keydown" || event=="keyup" || event=="holding"){
        eventObj.key = target;
    } else if (event=="click") {
        eventObj.sprite = target;
    }
    this.pool.push(eventObj);
};


function hoverJudger(sprite, handler, cursor, debugMode){
    if(sprite.touched(cursor)){
        handler.call(sprite);
        if(debugMode){
            console.log("Just fired a hover handler at: ("+cursor.x+","+cursor.y+")");
        }
    }
}

function clickJudger(sprite, handler, clicked, debugMode){
    if(clicked.x && clicked.y){ // 如果有點擊記錄才檢查
        if(sprite){ // 如果是 Sprite, 則對其做判定
            var crossX = (sprite.x+sprite.width/2)>clicked.x && clicked.x>(sprite.x-sprite.width/2),
                crossY = (sprite.y+sprite.height/2)>clicked.y && clicked.y>(sprite.y-sprite.height/2);
            if( sprite.touched(clicked.x,clicked.y) ){
                handler.call(sprite);
                if(debugMode){
                    console.log("Just fired a click handler on a sprite! ("+JSON.stringify(clicked)+")");
                }
            }
        } else { // 如果為 null, 則對整個遊戲舞台做判定
            handler();
            if(debugMode){
                console.log("Just fired a click handler on stage! ("+JSON.stringify(clicked)+")");
            }
        }
    }
}

function keydownJudger(key, handler, keydown, debugMode){
    if(keydown[key]){
        handler();
        if(debugMode){
            console.log("Just fired a keydown handler on: "+key);
        }
    }
}

function keyupJudger(key, handler, keyup, debugMode){
    if(keyup[key]){
        handler();
        if(debugMode){
            console.log("Just fired a keyup handler on: "+key);
        }
    }
}

function holdingJudger(key, handler, holding, debugMode){
    if(holding[key]){
        handler();
        if(debugMode){
            console.log("Just fired a holding handler on: "+key);
        }
    }
}

// @TODO: Now we could only detect Sprite instance, not include cursor.
function touchJudger(sprites, handler, debugMode){
    var sprite = sprites[0];
    for(var i=1, target; target = sprites[i]; i++) {
        if(sprite.touched(target)) {
            handler.call(sprite, target);
            if(debugMode) {
                console.log({event:"Touch", "sprite":sprite, "target":target});
            }
        }
    }
}

function clearEventRecord(io){
    io.clicked.x=null;
    io.clicked.y=null;
    for(var key in io.keydown){
        io.keydown[key]=false;
        io.keyup[key]=false;
    }
}

module.exports = EventList;