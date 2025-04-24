function getKey(e){
    const specialKeys = {
        "Backspace": "backspace",
        "Tab": "tab",
        "Enter": "enter",
        "Shift": "shift",
        "Control": "ctrl",
        "Alt": "alt",
        "Pause": "pause/break",
        "CapsLock": "caps lock",
        "Escape": "esc",
        " ": "space",
        "PageUp": "page up",
        "PageDown": "page down",
        "End": "end",
        "Home": "home",
        "ArrowLeft": "left",
        "ArrowUp": "up",
        "ArrowRight": "right",
        "ArrowDown": "down",
        "Insert": "insert",
        "Delete": "delete",
        "Meta": "command"
    };
    if (e.key in specialKeys) {
        return specialKeys[e.key];
    } else {
        return e.key;
    }
}

/**
 * IO 類別用於處理 HTML Canvas 的輸入事件 (滑鼠、觸控、鍵盤)。
 * @param {HTMLCanvasElement} canvas - 目標 canvas 元素。
 * @param {object} [settings] - 設定物件。
 * @param {boolean} [settings.debugMode=false] - 是否啟用除錯模式。
 */
function IO(canvas, settings){

    // 滑鼠/觸控指標狀態
    var cursor    = this.cursor    = { x: 0, y: 0, isDown: false, left: false, right: false }
    // 最後一次點擊事件的位置
    var clicked   = this.clicked   = { x: null, y: null }
    // 最後一次滑鼠按下事件的位置
    var mousedown = this.mousedown = { x: null, y: null }
    // 最後一次滑鼠放開事件的位置
    var mouseup   = this.mouseup   = { x: null, y: null }
    // 最近一幀鍵盤放開事件的狀態
    var keyup     = this.keyup     = { any: false }
    // 最近一幀鍵盤按下事件的狀態
    var keydown   = this.keydown   = { any: false }
    // 目前按住的按鍵狀態
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

    // // 建立所有的按鍵並設為 false，避免 undefined 所造成的 exception
    // for(var _key in keycode.codes){ holding[_key] = false; }

    var debugMode = !!settings.debugMode;

    // 使 canvas 元素可聚焦以接收 keydown 事件
    canvas.setAttribute("tabindex",'1');
    canvas.style.outline = "none"; // 移除聚焦時的輪廓線

    // 防止右鍵選單彈出
    canvas.oncontextmenu = function () {
        return false;
    }

    // 滑鼠按下事件監聽器
    canvas.addEventListener("mousedown", function(e){
        if(e.button == 0) cursor.left = true; // 主要按鈕 (通常是左鍵)
        if(e.button == 2) cursor.right = true; // 次要按鈕 (通常是右鍵)
        cursor.isDown = true;
        // 根據縮放比例校正座標
        mousedown.x = e.offsetX / zoomX;
        mousedown.y = e.offsetY / zoomY;
    });

    // 滑鼠放開事件監聽器
    canvas.addEventListener("mouseup", function(e){
        if(e.button == 0) cursor.left = false;
        if(e.button == 2) cursor.right = false;
        cursor.isDown = cursor.left || cursor.right; // 只有當左右鍵都放開時才算放開
        // 根據縮放比例校正座標
        mouseup.x = e.offsetX / zoomX;
        mouseup.y = e.offsetY / zoomY;
    });

    // 滑鼠移動事件監聽器
    canvas.addEventListener("mousemove", function(e){
        // 根據縮放比例校正座標
        cursor.x = e.offsetX / zoomX;
        cursor.y = e.offsetY / zoomY;
    });

    // 觸控開始事件監聽器 (模擬滑鼠按下)
    canvas.addEventListener("touchstart", function (e) {
        cursor.isDown = true;
        var pos = getTouchPos(e.changedTouches[0]); // 計算觸控點在 canvas 上的相對位置
        cursor.x = mousedown.x = pos.x;
        cursor.y = mousedown.y = pos.y;
    });

    // 觸控結束事件監聽器 (模擬滑鼠放開)
    canvas.addEventListener("touchend", function (e) {
        cursor.isDown = false;
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = mouseup.x = pos.x;
        cursor.y = mouseup.y = pos.y;
    });

    // 觸控移動事件監聽器 (模擬滑鼠移動)
    canvas.addEventListener("touchmove", function (e) {
        var pos = getTouchPos(e.changedTouches[0]);
        cursor.x = pos.x;
        cursor.y = pos.y;
    });

    /**
     * 計算觸控點相對於 canvas 左上角的座標。
     * @param {Touch} touch - 觸控事件中的 Touch 物件。
     * @returns {{x: number, y: number}} 校正後的座標。
     */
    function getTouchPos (touch) {
        // 考慮 canvas 的 offset 和頁面滾動以及縮放
        return {
            x: (touch.pageX - canvas.offsetLeft) / zoomX,
            y: (touch.pageY - canvas.offsetTop) / zoomY
        }
    }

    // 點擊事件監聽器
    canvas.addEventListener("click", function(e){
        // 根據縮放比例校正座標
        clicked.x = e.offsetX / zoomX;
        clicked.y = e.offsetY / zoomY;
        if(debugMode){
            console.log( "Clicked! cursor:"+JSON.stringify(cursor) );
        }
    });

    // 鍵盤按下事件監聽器
    canvas.addEventListener("keydown", function(e){
        var key = getKey(e); // 將 e.key 轉換為可讀的鍵名
        // 如果此鍵之前未被按下，增加按鍵計數
        if(!holding[key]) holding.any = (holding.count += 1) > 0;
        keydown.any = true; // 標記有鍵被按下
        keydown[key] = true; // 標記特定鍵被按下
        holding[key] = true; // 標記特定鍵正在被按住
        if(debugMode){
            console.log( "Keydown! key:"+key );
        }
    });

    // 鍵盤放開事件監聽器
    canvas.addEventListener("keyup", function(e){
        var key = getKey(e);
        // 減少按鍵計數，如果計數大於 0，表示仍有其他鍵被按住
        holding.any = (holding.count -= 1) > 0;
        keyup.any = true; // 標記有鍵被放開
        keyup[key] = true; // 標記特定鍵被放開
        holding[key] = false; // 標記特定鍵已放開
        if(debugMode){
            console.log( "Keyup! key:"+key );
        }
    });
};

/**
 * 清除單次觸發的事件狀態 (click, mousedown, mouseup, keydown, keyup)。
 * 保留持續狀態 (cursor, holding)。
 * 通常在每一幀渲染結束後調用。
 */
IO.prototype.clearEvents = function(){
    // 清除點擊、按下、放開的位置信息
    this.clicked.x = null;
    this.clicked.y = null;
    this.mousedown.x = null;
    this.mousedown.y = null;
    this.mouseup.x = null;
    this.mouseup.y = null;
    // 重置 keydown 和 keyup 的狀態
    for(let key in this.keydown){
        this.keydown[key] = false;
        this.keyup[key] = false;
    }
}

module.exports = IO;