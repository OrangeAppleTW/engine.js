var util = require("./util");
var hitCanvas = document.createElement('canvas'),
    hitTester = hitCanvas.getContext('2d');

function Sprite(args) {

    if (args.constructor === String || args.constructor === Array) {
        args = { costumes: [].concat(args) }
    }

    this.x = util.isNumeric(args.x) ? args.x : this._settings.width/2;
    this.y = util.isNumeric(args.y) ? args.y : this._settings.height/2;
    this.width = 1;
    this.height = 1;
    this.direction = util.isNumeric(args.direction) ? args.direction : 90;
    this.rotationStyle = args.rotationStyle || "full"; // "full", "flipped" and "fixed"
    this.scale = args.scale || 1;
    this.costumes = [].concat(args.costumes); // Deal with single string
    this.hidden = args.hidden || false;
    this.layer = util.isNumeric(args.layer) ? args.layer : 0;
    this.opacity = util.isNumeric(args.opacity) ? args.opacity : 1;
    this.costumeId = 0;

    this._onTickFuncs = [];
    this._deleted = false;

    this._animation = { frames: [], rate: 5, timer: 0 }

    //== In prototype:
    // * this._eventList;
    // * this._settings;
    // * this._renderer;
    // * this._sprites;
    this._sprites._sprites.push(this);
}

Sprite.prototype.update = function () {
    this._updateDirection();
    this._updateFrames();
    for (var i=0; i < this._onTickFuncs.length; i++) {
        this._onTickFuncs[i].call(this);
    }
}

Sprite.prototype._updateDirection = function () {
    this.direction = this.direction % 360;
    if(this.direction < 0) this.direction += 360;
}

Sprite.prototype._updateFrames = function () {
    var animate = this._animation;
    if(animate.frames.length > 0) {
        var now = new Date().getTime();
        if(now >= animate.timer + 1000 / animate.rate) {
            animate.timer = now;
            this.costumeId = animate.frames.shift();
            if(animate.frames.length <= 0 && animate.callback) animate.callback();
        }
    }
}

Sprite.prototype.moveTo = function(){
    if(util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)) {
        this.x = arguments[0].x;
        this.y = arguments[0].y;
    } else if (util.isNumeric(arguments[0]) && util.isNumeric(arguments[1])) {
        this.x = arguments[0];
        this.y = arguments[1];
    } else {
        throw "請傳入角色(Sprite, Cursor)或是 X, Y 座標值"
    }
};

Sprite.prototype.move = function(x, y){
    this.x += x;
    this.y += y;
};

Sprite.prototype.stepForward = function(distance){
    var rad = util.degreeToRad(this.direction)
    this.x += Math.sin(rad)*distance;
    this.y -= Math.cos(rad)*distance;
};

Sprite.prototype.bounceEdge = function () {
    if (this.x < 0) {
        this.x = 0;
        if (this.direction > 180 && this.direction > 0) {
            this.direction = -this.direction;
        }
    }
    if (this.x > this._settings.width) {
        this.x = this._settings.width;
        if (this.direction < 180) {
            this.direction = -this.direction;
        }
    }
    if (this.y < 0) {
        this.y = 0;
        if (this.direction < 90 || this.direction > 270) {
            this.direction = -this.direction + 180;
        }
    }
    if (this.y > this._settings.height) {
        this.y = this._settings.height;
        if (this.direction > 90 || this.direction < 270) {
            this.direction = -this.direction + 180;
        }
    }
}

Sprite.prototype.toward = function(){
    var targetX, targetY, offsetX, offsetY, rad;
    if(util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)){
        targetX = arguments[0].x,
        targetY = arguments[0].y;
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
        targetX = arguments[0],
        targetY = arguments[1];
    } else {
        throw "請傳入角色(Sprite)或是 X, Y 坐標值";
    }
    offsetX = targetX - this.x;
    offsetY = targetY - this.y;
    rad = Math.atan2(offsetX, -offsetY); // 這裡的 offsetY 和數學坐標是反過來的
    this.direction = util.radToDegree(rad);
}

Sprite.prototype.touched = function () {
    if (arguments[0].constructor === Array) {
        for(var i=0; i<arguments[0].length; i++){
            if (this._isTouched(arguments[0][i])){
                return true;
            }
        }
        return false;
    } else {
        return this._isTouched.apply(this, arguments);
    }
    
};

Sprite.prototype.distanceTo = function(){
    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
        return util.distanceBetween( this, arguments[0] );
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
    } else {
        throw "請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";
    }
};

Sprite.prototype.always = Sprite.prototype.forever = function(func){
    this._onTickFuncs.push(func);
};

Sprite.prototype.when = Sprite.prototype.on = function() {

    var event = arguments[0];
    var eventList = this._eventList;

    if(event=="listen") {
        return eventList.register(event, arguments[1], this, arguments[2]);
    } else if(["mousedown", "mouseup", "click"].includes(event)){
        return eventList.register(event, this, arguments[1]);
    } else if (event=="touch"){
        return eventList.register(event, this, arguments[1], arguments[2]);
    } else {
        console.log('Sprite.on() does only support "listen", "click" and "touch" events');
        return false;
    }
};

Sprite.prototype.destroy = function(){
    this._deleted = true;
};

Sprite.prototype.getCurrentCostume = function(){
    var id = this.costumeId;
    return this.costumes[id];
};

Sprite.prototype.animate = function (frames, frameRate, callback) {
    this._animation = {
        frames: frames,
        rate: frameRate || 5,
        callback: callback,
        timer: 0
    }
}

Sprite.prototype.nextCostume = function () {
    this.costumeId += 1;
    if(this.costumeId >= this.costumes.length) {
        this.costumeId = 0;
    }
}

Sprite.prototype._isTouched = function () {

    // 自己或是對象狀態是隱藏或銷毀，則回傳 false
    if (this.hidden || this._deleted) return false;
    if (arguments[0] instanceof Sprite) {
        var target = arguments[0];
        if (target.hidden || target._deleted || target === this) return false;
    }

    var thisRange, targetRange;

    // 由於效能考量，先用成本最小的「圓形範圍演算法」判斷是否有機會「像素重疊」
    thisRange = Math.sqrt(Math.pow(this.width / 2, 2) + Math.pow(this.height / 2, 2));
    if (arguments[0] instanceof Sprite) {
        targetRange = Math.sqrt(Math.pow(target.width / 2, 2) + Math.pow(target.height / 2, 2));
    } else {
        targetRange = 1;
    }
    if (this.distanceTo.apply(this, arguments) > (thisRange + targetRange)) {
        return false;
    }

    // 如果經過「圓形範圍演算法」判斷，兩者有機會重疊，則進一步使用「像素重疊演算法」進行判斷
    hitCanvas.width = this._settings.width;
    hitCanvas.height = this._settings.height;

    hitTester.globalCompositeOperation = 'source-over';
    if (arguments[0] instanceof Sprite){
        var tmp = arguments[0].opacity;
        arguments[0].opacity = 1;
        this._renderer.drawInstance(arguments[0], hitTester);
        arguments[0].opacity = tmp;
    } else if (util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)) {
        hitTester.fillRect(arguments[0].x,arguments[0].y,1,1);
    } else if (util.isNumeric(arguments[0]) && util.isNumeric(arguments[1])) {
        hitTester.fillRect(arguments[0],arguments[1],1,1);
    } else {
        throw "請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";
    }

    hitTester.globalCompositeOperation = 'source-in';
    var tmp = this.opacity;
    this.opacity = 1;
    this._renderer.drawInstance(this, hitTester);
    this.opacity = tmp;

    var aData;
    if (arguments[0] instanceof Sprite){
        if (thisRange < targetRange) {
            aData = hitTester.getImageData(this.x-thisRange/2, this.y-thisRange/2, thisRange*2, thisRange*2).data;
        } else {
            aData = hitTester.getImageData(target.x-targetRange/2, target.y-targetRange/2, targetRange*2, targetRange*2).data;
        }
    } else if (util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y)) {
        aData = hitTester.getImageData(arguments[0].x, arguments[0].x, 1, 1).data;
    } else if (util.isNumeric(arguments[0]) && util.isNumeric(arguments[1])) {
        aData = hitTester.getImageData(arguments[0], arguments[1], 1, 1).data;
    }

    var pxCount = aData.length;
    for (var i = 0; i < pxCount; i += 4) {
        if (aData[i+3] > 0) {
            return true;
        }
    }
    return false;
}

module.exports = Sprite;