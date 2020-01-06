var keycode = require('keycode');

function IO(canvas, settings){

    var cursor    = this.cursor    = { x: 0, y: 0, isDown: false, left: false, right: false }
    var clicked   = this.clicked   = { x: null, y: null }
    var mousedown = this.mousedown = { x: null, y: null }
    var mouseup   = this.mouseup   = { x: null, y: null }
    var keyup     = this.keyup     = { any: false }
    var keydown   = this.keydown   = { any: false }
    var holding   = this.holding   = { any: false, count: 0 }
    
    // 遊戲場景響應式的縮放是交由外部 css 樣式來控制
    // zoom 表示遊戲場景的縮放比例，讓滑鼠事件或是觸控事件的觸發位置精準偵測
    // 因為沒有針對單一元素 resize 的事件，因此改每 100ms 偵測一次 canvas 的大小
    var zoomX = 1;
    var zoomY = 1;
    setInterval(function () {
        var box = canvas.getBoundingClientRect();
        zoomX = box.width/canvas.width;
        zoomY = box.height/canvas.height;
    }, 100);

    // 建立所有的按鍵並設為 false，避免 undefined 所造成的 exception
    for(var _key in keycode.codes){ holding[_key] = false; }

    var debugMode = !!settings.debugMode;

    // Make any element focusable for keydown event.
    canvas.setAttribute("tabindex",'1');
    canvas.style.outline = "none";

    canvas.oncontextmenu = function () {
        return false;
    }

    canvas.addEventListener("mousedown", function(e){
        if(e.which == 1) cursor.left = true;
        if(e.which == 3) cursor.right = true;
        cursor.isDown = true;
        mousedown.x = e.offsetX / zoomX;
        mousedown.y = e.offsetY / zoomY;
    });

    canvas.addEventListener("mouseup", function(e){
        if(e.which == 1) cursor.left = false;
        if(e.which == 3) cursor.right = false;
        cursor.isDown = cursor.left || cursor.right;
        mouseup.x = e.offsetX / zoomX;
        mouseup.y = e.offsetY / zoomY;
    });

    canvas.addEventListener("mousemove", function(e){
        cursor.x = e.offsetX / zoomX;
        cursor.y = e.offsetY / zoomY;
    });

    canvas.addEventListener("touchstart", function (e) {
        cursor.isDown = true;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mousedown.x = pos.x;
        cursor.y = mousedown.y = pos.y;
    });

    canvas.addEventListener("touchend", function (e) {
        cursor.isDown = false;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mouseup.x = pos.x;
        cursor.y = mouseup.y = pos.y;
    });

    canvas.addEventListener("touchmove", function (e) {
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = pos.x;
        cursor.y = pos.y;
    });

    function getTouchPos (touch) {
        return {
            x: (touch.pageX - canvas.offsetLeft) / zoomX,
            y: (touch.pageY - canvas.offsetTop) / zoomY
        }
    }

    canvas.addEventListener("click", function(e){
        clicked.x = e.offsetX / zoomX;
        clicked.y = e.offsetY / zoomY;
        if(debugMode){
            console.log( "Clicked! cursor:"+JSON.stringify(cursor) );
        }
    });

    canvas.addEventListener("keydown", function(e){
        var key = keycode(e.keyCode);
        if(!holding[key]) holding.any = (holding.count += 1) > 0;
        keydown.any = true;
        keydown[key] = true;
        holding[key] = true;
        if(debugMode){
            console.log( "Keydown! key:"+key );
        }
    });

    canvas.addEventListener("keyup", function(e){
        var key = keycode(e.keyCode);
        holding.any = (holding.count -= 1) > 0;
        keyup.any = true;
        keyup[key] = true;
        holding[key] = false;
        if(debugMode){
            console.log( "Keyup! key:"+key );
        }
    });
};

IO.prototype.clearEvents = function(){
    this.clicked.x = null;
    this.clicked.y = null;
    this.mousedown.x = null;
    this.mousedown.y = null;
    this.mouseup.x = null;
    this.mouseup.y = null;
    for(var key in this.keydown){
        this.keydown[key] = false;
        this.keyup[key] = false;
    }
}

module.exports = IO;