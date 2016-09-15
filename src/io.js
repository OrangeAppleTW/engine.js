var keycode = require('keycode');

var io = function(canvas, debugMode){
    
    var exports={},
        cursor={x:0, y:0},
        key=[],
        clicked={x:null, y:null},
        keyup={},
        keydown={},
        holding={};

    debugMode = debugMode || false;

    // Make any element focusable for keydown event.
    canvas.setAttribute("tabindex",'1');
    canvas.style.outline = "none";

    canvas.addEventListener("mousemove", function(e){
        cursor.x = e.offsetX;
        cursor.y = e.offsetY;
    });

    canvas.addEventListener("click", function(e){
        clicked.x = e.offsetX;
        clicked.y = e.offsetY;
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