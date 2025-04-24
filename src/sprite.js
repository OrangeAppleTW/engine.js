var util = require('./util');

function Sprite(args, eventList, renderer, loader, touchSystem, sprites) {

    if (args.constructor === String || args.constructor === Array) {
        args = { costumes: [].concat(args) }
    }

    this.x = util.isNumeric(args.x) ? args.x : renderer.canvas.width/2;
    this.y = util.isNumeric(args.y) ? args.y : renderer.canvas.height/2;
    this.direction = util.isNumeric(args.direction) ? args.direction : 90;
    this.scale = util.isNumeric(args.scale) ? args.scale : 1;
    this.layer = util.isNumeric(args.layer) ? args.layer : 0;
    this.opacity = util.isNumeric(args.opacity) ? args.opacity : 1;
    this.costumeId = util.isNumeric(args.costumeId) ? args.costumeId : 0;
    this.costumes = [].concat(args.costumes); // Deal with single string
    this.hidden = !!args.hidden; // change to boolean
    this.rotationStyle = ['full','flipped','fixed'].includes(args.rotationStyle) ? args.rotationStyle : 'full'; 
    this.width = 1;
    this.height = 1;

    this._onTickFuncs = [];
    this._deleted = false;
    this._animation = { frames: [], rate: 5, timer: 0 }

    this._eventList = eventList;
    this._renderer = renderer;
    this._loader = loader;
    this._touchSystem = touchSystem;

    sprites._sprites.push(this);
}

Sprite.prototype = {

    stepForward: function (distance) {
        var rad = util.degreeToRad(this.direction);
        this.x += Math.sin(rad)*distance;
        this.y -= Math.cos(rad)*distance;
    },

    moveTo: function () {
        var pos = util.position(arguments);
        this.x = pos.x;
        this.y = pos.y;
    },

    move: function (x, y) {
        this.x += x;
        this.y += y;
    },

    toward: function () {
        var target = util.position(arguments);
        this.direction = util.vectorToDegree(target.x - this.x,  target.y - this.y);
    },

    touched: function () {
        if (arguments[0].constructor === Array) {
            for(let i=0; i<arguments[0].length; i++){
                if (this._isTouched(arguments[0][i])){
                    return true;
                }
            }
            return false;
        } else {
            return this._isTouched.apply(this, arguments);
        }
    },

    distanceTo: function () {
        var pos = util.position(arguments);
        return util.distanceBetween(this.x, this.y, pos.x, pos.y);
    },

    forever: function (func) {
        this._onTickFuncs.push(func);
    },

    on: function () {
        var eventName = arguments[0];
        var eventList = this._eventList;

        if (!eventList.validEventName(eventName)) return;

        if (eventName === 'touch') {
            return eventList.register(eventName, this, arguments[1], arguments[2]);
        }
        if (['mousedown', 'mouseup', 'click', 'hover'].includes(eventName)) {
            return eventList.register(eventName, this, arguments[1]);
        }
        if (['keydown', 'keydup', 'holding'].includes(eventName)) {
            return eventList.register(eventName, arguments[1], arguments[2]);
        }
        if (eventName === 'listen') {
            return eventList.register(eventName, arguments[1], this, arguments[2]);
        }
    },

    destroy: function(){
        this._deleted = true;
    },

    nextCostume: function () {
        this.costumeId += 1;
        if(this.costumeId >= this.costumes.length) {
            this.costumeId = 0;
        }
    },

    bounceEdge: function () {
        var stage = this._renderer.canvas;
        if (this.x < 0) {
            this.x = 0;
            if (this.direction > 180 && this.direction > 0) {
                this.direction = -this.direction;
            }
        }
        else if (this.x > stage.width) {
            this.x = stage.width;
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
        else if (this.y > stage.height) {
            this.y = stage.height;
            if (this.direction > 90 || this.direction < 270) {
                this.direction = -this.direction + 180;
            }
        }
    },

    animate: function (frames, frameRate, callback) {
        this._animation = {
            frames: frames,
            rate: frameRate || 5,
            callback: callback,
            timer: 0
        }
    },

    getCostumeImage: function () {
        var id = this.costumes[this.costumeId];
        return this._loader.getImgFromCache(id);
    },

    update: function () {
        this._updateDirection();
        this._updateSize();
        this._updateFrames();
        for (let i=0; i < this._onTickFuncs.length; i++) {
            this._onTickFuncs[i].call(this);
        }
    },

    _updateDirection: function () {
        this.direction = this.direction % 360;
        if(this.direction < 0) this.direction += 360;
    },

    _updateSize: function () {
        var img = this.getCostumeImage();
        this.width = img.width * this.scale;
        this.height = img.height * this.scale;
    },

    _updateFrames: function () {
        var animate = this._animation;
        if(animate.frames.length > 0) {
            var now = new Date().getTime();
            if(now >= animate.timer + 1000 / animate.rate) {
                animate.timer = now;
                this.costumeId = animate.frames.shift();
                if(animate.frames.length <= 0 && animate.callback) animate.callback();
            }
        }
    },

    _isTouched: function () {
        if (arguments[0] instanceof Sprite) {
            return this._touchSystem.isTouch(this, arguments[0]);
        }
        var pos = util.position(arguments);
        return this._touchSystem.isTouchDot(this, pos.x, pos.y);
    },
}

Sprite.prototype.when = Sprite.prototype.on;
Sprite.prototype.always = Sprite.prototype.forever;

module.exports = Sprite;