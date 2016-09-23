function eventList(io, debugMode){
    var exports={},
        pool=[];

    debugMode = debugMode || false;

    function hoverJudger(sprite, handler){
        var crossX = (sprite.x+sprite.width/2)>io.cursor.x && io.cursor.x>(sprite.x-sprite.width/2),
            crossY = (sprite.y+sprite.height/2)>io.cursor.y && io.cursor.y>(sprite.y-sprite.height/2);
        if(crossX && crossY){
            handler.call(sprite);
            if(debugMode){
                console.log("Just fired a hover handler at: "+JSON.stringify(io.clicked));
            }
        }
    }

    function clickJudger(sprite, handler){
        if(io.clicked.x && io.clicked.y){ // 如果有點擊記錄才檢查
            if(sprite){
                // 如果是 Sprite, 則對其做判定
                var crossX = (sprite.x+sprite.width/2)>io.clicked.x && io.clicked.x>(sprite.x-sprite.width/2),
                    crossY = (sprite.y+sprite.height/2)>io.clicked.y && io.clicked.y>(sprite.y-sprite.height/2);
                if(crossX && crossY){
                    handler.call(sprite);
                }
                if(debugMode){
                    console.log("Just fired a click handler on a sprite! ("+JSON.stringify(io.clicked)+")");
                }
            } else {
                // 如果為 null, 則對整個遊戲舞台做判定
                handler();
                if(debugMode){
                    console.log("Just fired a click handler on stage! ("+JSON.stringify(io.clicked)+")");
                }
            }
        }
    }

    function keydownJudger(key, handler){
        if(io.keydown[key]){
            handler();
            if(debugMode){
                console.log("Just fired a keydown handler on: "+key);
            }
        }
    }

    function keyupJudger(key, handler){
        if(io.keyup[key]){
            handler();
            if(debugMode){
                console.log("Just fired a keyup handler on: "+key);
            }
        }
    }

    function holdingJudger(key, handler){
        if(io.holding[key]){
            handler();
            if(debugMode){
                console.log("Just fired a holding handler on: "+key);
            }
        }
    }

    // @TODO: Now we could only detect Sprite instance, not include cursor.
    function touchJudger(sprites, handler){
        if(!sprites.length || sprites.length<2){
            console.log("You must pass a sprites array which length is bigger than 1 as the second argument!");
            return;
        }
        for(var i=1; i<sprites.length; i++){
            if(!sprites[i-1].touched(sprites[i])){
                return false;
            }
        }
        handler();
        if(debugMode){
            console.log("Just fired a touch handler on: "+sprites);
        }
        return true; // we do not need this.
    }

    function clearEventRecord(){
        io.clicked.x=null;
        io.clicked.y=null;
        for(var key in io.keydown){
            io.keydown[key]=false;
            io.keyup[key]=false;
        }
    }

    exports.register = function(event, target, handler){
        var eventObj = {
            event:event,
            handler:handler
        }
        // @TODO: target 型別偵測
        if (event=="touch"){
            eventObj.sprites = target;
        } else if (event=="keydown" || event=="keyup" || event=="holding"){
            eventObj.key = target;
        } else if (event=="hover" || event=="click") {
            eventObj.sprite = target;
        }
        pool.push(eventObj);
    };
    exports.traverse = function (){
        for(var i=0; i<pool.length; i++){
            if (pool[i].event=="hover") { hoverJudger( pool[i].sprite, pool[i].handler ); }
            else if (pool[i].event=="click") { clickJudger( pool[i].sprite, pool[i].handler ); }
            else if (pool[i].event=="keydown") { keydownJudger(pool[i].key, pool[i].handler); }
            else if (pool[i].event=="keyup") { keydownJudger(pool[i].key, pool[i].handler); }
            else if (pool[i].event=="holding") { holdingJudger(pool[i].key, pool[i].handler); }
            else if (pool[i].event=="touch") { touchJudger(pool[i].sprites, pool[i].handler); }
        }
        clearEventRecord();
    }
    exports.clear = function(){
        pool=[];
    }
    return exports;
}

module.exports = eventList;