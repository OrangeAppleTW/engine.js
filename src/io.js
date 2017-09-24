var keycode = require('keycode');

function IO(canvas, settings, debugMode){

    var cursor    = this.cursor    = { x: 0, y: 0, isDown: false, left: false, right: false }
    var clicked   = this.clicked   = { x: null, y: null }
    var mousedown = this.mousedown = { x: null, y: null }
    var mouseup   = this.mouseup   = { x: null, y: null }
    var keyup     = this.keyup     = { any: false }
    var keydown   = this.keydown   = { any: false }
    var holding   = this.holding   = { any: false, count: 0 }

    debugMode = debugMode || false;

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
        mousedown.x = e.offsetX / settings.zoom;
        mousedown.y = e.offsetY / settings.zoom;
    });

    canvas.addEventListener("mouseup", function(e){
        if(e.which == 1) cursor.left = false;
        if(e.which == 3) cursor.right = false;
        cursor.isDown = cursor.left || cursor.right;
        mouseup.x = e.offsetX / settings.zoom;
        mouseup.y = e.offsetY / settings.zoom;
    });

    canvas.addEventListener("mousemove", function(e){
        cursor.x = e.offsetX / settings.zoom;
        cursor.y = e.offsetY / settings.zoom;
    });

    canvas.addEventListener("touchstart", function (e) {
        cursor.isDown = true;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mousedown.x = pos.x;
        cursor.y = mousedown.y = pos.x;
    });

    canvas.addEventListener("touchend", function (e) {
        cursor.isDown = false;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mouseup.x = pos.x;
        cursor.y = mouseup.y = pos.x;
    });

    canvas.addEventListener("touchmove", function (e) {
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = pos.x;
        cursor.y = pos.x;
    });

    function getTouchPos (touch) {
        return {
            x: (touch.pageX - canvas.offsetLeft) / settings.zoom,
            y: (touch.pageY - canvas.offsetTop) / settings.zoom
        }
    }

    canvas.addEventListener("click", function(e){
        clicked.x = e.offsetX / settings.zoom;
        clicked.y = e.offsetY / settings.zoom;
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