var keycode = require('keycode');
var exports={},
    cursor={x:0, y:0},
    key=[],
    clicked={x:null, y:null},
    keyup={},
    keydown={};

var io = function(canvas){

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
    });

    canvas.addEventListener("keydown", function(e){
        keydown[keycode(e.keyCode)] = true;
    });

    canvas.addEventListener("keyup", function(e){
        keyup[keycode(e.keyCode)] = true;
    });

    exports.cursor = cursor;
    exports.clicked = clicked;
    exports.keyup = keyup;
    exports.keydown = keydown;
    return exports;
};

module.exports = io;