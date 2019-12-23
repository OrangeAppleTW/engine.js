var util = require("./util");

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
    // * this._loader;
    this._sprites._sprites.push(this);
}

Sprite.prototype.update = function () {
    this._updateDirection();
    this._updateSize();
    this._updateFrames();
    for (var i=0; i < this._onTickFuncs.length; i++) {
        this._onTickFuncs[i].call(this);
    }
}

Sprite.prototype._updateDirection = function () {
    this.direction = this.direction % 360;
    if(this.direction < 0) this.direction += 360;
}

Sprite.prototype._updateSize = function () {
    var img = this.getCostumeImage();
    this.width = img.width * this.scale;
    this.height = img.height * this.scale;
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
    var pos = util.position(arguments);
    this.x = pos.x;
    this.y = pos.y;
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
    else if (this.x > this._settings.width) {
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
    else if (this.y > this._settings.height) {
        this.y = this._settings.height;
        if (this.direction > 90 || this.direction < 270) {
            this.direction = -this.direction + 180;
        }
    }
}

Sprite.prototype.toward = function(){
    var target = util.position(arguments);
    this.direction = util.vectorToDegree(target.x - this.x,  target.y - this.y);
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
    var pos = util.position(arguments);
    return util.distanceBetween(this.x, this.y, pos.x, pos.y);
};

Sprite.prototype.always = Sprite.prototype.forever = function(func){
    this._onTickFuncs.push(func);
};

Sprite.prototype.when = Sprite.prototype.on = function() {

    var event = arguments[0];
    var eventList = this._eventList;

    if(event=="listen") {
        return eventList.register(event, arguments[1], this, arguments[2]);
    } else if(["mousedown", "mouseup", "click", "hover"].includes(event)){
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

Sprite.prototype.getCostumeImage = function () {
    var id = this.costumes[this.costumeId];
    return this._loader.getImgFromCache(id);
}

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
    if (arguments[0] instanceof Sprite) {
        return this._touchSystem.isTouch(this, arguments[0]);
    }
    var pos = util.position(arguments);
    return this._touchSystem.isTouchDot(this, pos.x, pos.y);
}

module.exports = Sprite;