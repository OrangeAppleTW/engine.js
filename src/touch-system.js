var util = require("./util");
var Sprite = require('./sprite');
var Renderer = require('./renderer');

function TouchSystem(canvas, loader, settings) {
    this.ctx = canvas.getContext('2d');
    this.renderer = new Renderer(canvas, loader, settings);
    this.settings = settings;
}

TouchSystem.prototype = {

    isTouchDot: function (sprite, x, y) {
        return this.isTouch(sprite, {
            x: x,
            y: y,
            width: this.settings.precision*2,
            height: this.settings.precision*2,
            direction: 0,
            area: 1,
        });
    },

    isTouch: function (spriteA, spriteB) {

        if (spriteA.hidden || spriteA._deleted ||
            spriteB.hidden || spriteB._deleted ||
            spriteA === spriteB) return false;

        var boxA = this.getBoxOf(spriteA);
        var boxB = this.getBoxOf(spriteB);

        if (this.AABBJudger(boxA, boxB) === false) return false;
        
        var undoA = this.reduceAccuracy(spriteA);
        var undoB = this.reduceAccuracy(spriteB);

        var box = boxA.area < boxB.area ? boxA : boxB;
        this.reduceAccuracy(box);
        result = this.pixelJudger(spriteA, spriteB, box);

        undoA();
        undoB();

        return result;
    },

    getBoxOf: function (sprite) {

        var box = { x: sprite.x, y: sprite.y, area: sprite.width*sprite.height }

        if (sprite.direction === 90 || sprite.direction === 270 || sprite.rotationStyle !== 'full') {
            box.width = sprite.width;
            box.height = sprite.height;
            return box;
        }
        if (sprite.direction === 0 || sprite.direction === 180 ) {
            box.width = sprite.height;
            box.height = sprite.width;
            return box;
        }

        var length = Math.sqrt(sprite.width * sprite.width + sprite.height * sprite.height);
        var angle = Math.asin(sprite.width / length);
        var a1 = util.degreeToRad(sprite.direction) - angle;
        var a2 = util.degreeToRad(sprite.direction) + angle;

        var a1y = Math.abs(Math.sin(a1));
        var a1x = Math.abs(Math.cos(a1));
        var a2y = Math.abs(Math.sin(a2));
        var a2x = Math.abs(Math.cos(a2));

        box.width = Math.max(a1x, a2x)*length;
        box.height = Math.max(a1y, a2y)*length;
        box.area = box.width*box.height;
        return box;
    },

    AABBJudger: function (boxA, boxB) {
        return Math.abs(boxA.x - boxB.x) < (boxA.width + boxB.width) / 2 &&
               Math.abs(boxA.y - boxB.y) < (boxA.height + boxB.height) / 2
    },

    pixelJudger: function (spriteA, spriteB, box) {

        this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);

        this.ctx.globalCompositeOperation = 'source-over';
        this.renderer.drawInstance(spriteA, this.ctx);

        this.ctx.globalCompositeOperation = 'source-in';
        if (spriteB instanceof Sprite) {
            this.renderer.drawInstance(spriteB, this.ctx);
        } else {
            this.ctx.fillRect(spriteB.x, spriteB.y, 1, 1);
        }

        var aData = this.ctx.getImageData(box.x - box.width/2, box.y - box.height/2, box.width, box.height).data;
        for (var i = 0; i < aData.length; i += 4) {
            if (aData[i + 3] > 0) return true;
        }
        return false;
    },

    reduceAccuracy: function (s) {
        var rate = this.settings.precision;
        var x = s.x;
        var y = s.y;
        var width = s.width;
        var height = s.height;
        var scale = s.scale;
        s.x /= rate;
        s.y /= rate;
        s.width /= rate;
        s.height /= rate;
        s.scale /= rate;
        return function () {
            s.x = x;
            s.y = y;
            s.width = width;
            s.height = height;
            s.scale = scale;
        }
    },
}

module.exports = TouchSystem;