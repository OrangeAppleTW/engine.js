var util = require("./util");
var Sprite = require('./sprite');

function TouchSystem(hitTester, renderer, settings) {
    this.hitTester = hitTester;
    this.renderer = renderer;
    this.settings = settings;
}

TouchSystem.prototype = {

    touchedDot: function (sprite, x, y) {
        var dotSprite = { x: x, y: y, width: 2, height: 2, direction: 0, area: 1 };
        return this.touched(sprite, dotSprite);
    },

    
    touched: function (spriteA, spriteB) {

        if (spriteA.hidden || spriteA._deleted ||
            spriteB.hidden || spriteB._deleted) return false;

        if (spriteA === spriteB) return false;

        var boxA = this.getBoxOf(spriteA);
        var boxB = this.getBoxOf(spriteB);

        if (this.AABB(boxA, boxB) === false) return false;

        return this.pixel(spriteA, spriteB, boxA, boxB);
    },

    // 取得角色的 AABB 矩形邊框
    getBoxOf: function (sprite) {
        var length = Math.sqrt(sprite.width * sprite.width + sprite.height * sprite.height);
        var angle = Math.asin(sprite.width / length);

        var a1 = util.degreeToRad(sprite.direction) - angle;
        var a2 = util.degreeToRad(sprite.direction) + angle;

        var a1y = Math.abs(Math.sin(a1) * length);
        var a1x = Math.abs(Math.cos(a1) * length);
        var a2y = Math.abs(Math.sin(a2) * length);
        var a2x = Math.abs(Math.cos(a2) * length);

        var width = Math.max(a1x, a2x);
        var height = Math.max(a1y, a2y);

        width = isNaN(width) ? 0 : width;
        height = isNaN(width) ? 0 : height;

        return {
            x: sprite.x,
            y: sprite.y,
            width: width,
            height: height,
            area: width * height,
        }
    },

    // 判斷兩個角色的矩形邊框是否重疊
    AABB: function (boxA, boxB) {
        return Math.abs(boxA.x - boxB.x) < (boxA.width + boxB.width)/2 &&
               Math.abs(boxA.y - boxB.y) < (boxA.height + boxB.height)/2
    },

    pixel: function (spriteA, spriteB, boxA, boxB) {

        var hitTester = this.hitTester;
        var renderer = this.renderer;

        hitTester.clearRect(0,0,this.settings.width,this.settings.height);
        
        hitTester.globalCompositeOperation = 'source-over';
        renderer.drawInstance(spriteA, hitTester);

        hitTester.globalCompositeOperation = 'source-in';
        if (spriteB instanceof Sprite) {
            renderer.drawInstance(spriteB, hitTester);
        } else {
            hitTester.fillRect(spriteB.x, spriteB.y, 1, 1);
        }

        var box = boxA.area < boxB.area ? boxA : boxB;
        var aData = hitTester.getImageData(box.x - box.width / 2, box.y - box.height / 2, box.width, box.height).data;
        var pxCount = aData.length;
        for (var i = 0; i < pxCount; i += 4) {
            if (aData[i + 3] > 0) {
                return true;
            }
        }
        return false;
    },
}

module.exports = TouchSystem;