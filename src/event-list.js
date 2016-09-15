var pool=[],
    io = {};

function eventList(importIo){
    var exports={};
    io = importIo;

    exports.register = function(event, target, handler){
        var eventObj = {
            event:event,
            handler:handler
        }
        // @TODO: target 型別偵測
        if (event=="keydown" || event=="keyup"){
            eventObj.key = target;
        } else {
            eventObj.sprite = target;
        }
        pool.push(eventObj);
    };
    exports.traverse = function (){
        for(let i=0; i<pool.length; i++){
            if (pool[i].event=="hover") { hoverJudger( pool[i].sprite, pool[i].handler ); }
            else if (pool[i].event=="click") { clickJudger( pool[i].sprite, pool[i].handler ); }
            else if (pool[i].event=="keydown") { keydownJudger(pool[i].key, pool[i].handler); }
            else if (pool[i].event=="keyup") {}
        }
        clearEventRecord();
    }
    exports.clear = function(){
        pool=[];
    }
    return exports;
}

function hoverJudger(sprite, handler){
    var crossX = (sprite.x+sprite.width/2)>io.cursor.x && io.cursor.x>(sprite.x-sprite.width/2),
        crossY = (sprite.y+sprite.height/2)>io.cursor.y && io.cursor.y>(sprite.y-sprite.height/2);
    if(crossX && crossY){
        handler.call(sprite);
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
        } else {
            // 如果為 null, 則對整個遊戲舞台做判定
            handler();
        }
    }
}

function keydownJudger(key, handler){
    if(io.keydown[key]){
        handler();
    }
}

function clearEventRecord(){
    io.clicked.x=null;
    io.clicked.y=null;
    for(let key in io.keydown){
        io.keydown[key]=false;
    }
}

module.exports = eventList;