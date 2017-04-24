var keycode = require('keycode');

var io = function(canvas, settings, debugMode){

    var exports={},
        cursor={x:0, y:0, isDown:null},
        key=[],
        clicked={x:null, y:null},
        keyup={},
        keydown={},
        holding={};

    debugMode = debugMode || false;

    // Make any element focusable for keydown event.
    canvas.setAttribute("tabindex",'1');
    canvas.style.outline = "none";

    canvas.addEventListener("mousedown", function(e){
        cursor.isDown = true;
    });

    canvas.addEventListener("mouseup", function(e){
        cursor.isDown = false;
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

    exports.cursor = cursor;
    exports.clicked = clicked;
    exports.keyup = keyup;
    exports.keydown = keydown;
    exports.holding = holding;
    return exports;
};

module.exports = io;