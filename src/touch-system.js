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
        var dotSprite = { x: x, y: y, width: 2, height: 2, direction: 0, area: 4 };
        return this.isTouch(sprite, dotSprite);
    },

    isTouch: function (spriteA, spriteB) {

        if (spriteA.hidden || spriteA._deleted ||
            spriteB.hidden || spriteB._deleted ||
            spriteA === spriteB) return false;

        var boxA = this.getBoxOf(spriteA);
        var boxB = this.getBoxOf(spriteB);

        if (this.AABBJudger(boxA, boxB) === false) return false;

        return this.pixelJudger(spriteA, spriteB, boxA.area < boxB.area ? boxA : boxB);
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
}

module.exports = TouchSystem;