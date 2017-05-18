var keycode = require('keycode');

function IO(canvas, settings, debugMode){
    var exports={},
        cursor={ x:0, y:0, isDown:false, left: false, right: false },
        key=[],
        clicked={x:null, y:null},
        mousedown={x:null, y:null},
        mouseup={x:null, y:null},
        keyup={},
        keydown={},
        holding={};

    this.mousedown = mousedown;
    this.mouseup = mouseup;

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

    canvas.addEventListener("click", function(e){
        clicked.x = e.offsetX / settings.zoom;
        clicked.y = e.offsetY / settings.zoom;
        if(debugMode){
            console.log( "Clicked! cursor:"+JSON.stringify(cursor) );
        }
    });

    canvas.addEventListener("keydown", function(e){
        var key = keycode(e.keyCode);
        keydown[key] = true;
        holding[key] = true;
        if(debugMode){
            console.log( "Keydown! key:"+key );
        }
    });

    canvas.addEventListener("keyup", function(e){
        var key = keycode(e.keyCode);
        keyup[key] = true;
        holding[key] = false;
        if(debugMode){
            console.log( "Keyup! key:"+key );
        }
    });

    this.cursor = cursor;
    this.clicked = clicked;
    this.keyup = keyup;
    this.keydown = keydown;
    this.holding = holding;
};

IO.prototype.clearEvents = function(){
    this.clicked.x=null;
    this.clicked.y=null;
    this.mousedown.x=null;
    this.mousedown.y=null;
    this.mouseup.x=null;
    this.mouseup.y=null;
    for(var key in this.keydown){
        this.keydown[key]=false;
        this.keyup[key]=false;
    }
}

module.exports = IO;