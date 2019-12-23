var util = require("./util");

function Renderer (canvasEl, loader, settings) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d');
    this.loader = loader;
    this.settings = settings;
}

Renderer.prototype = {
    
    clear: function() {
        this.ctx.clearRect(0, 0, this.settings.width, this.settings.height);
    },

    drawSprites: function(sprites){
        sprites._sprites.sort(function (a, b) {
            return a.layer - b.layer;
        });
        var self = this;
        sprites.each(function (s) {
            self.drawInstance(s);
        });
    },

    drawInstance: function(sprite, ctx){

        if (sprite.hidden) return;

        var ctx = ctx || this.ctx;

        var img = sprite.getCostumeImage();

        var rad = util.degreeToRad(sprite.direction - 90);
        ctx.globalAlpha = sprite.opacity;
        if (sprite.rotationStyle === 'flipped') {
            if(sprite.direction > 180) {
                ctx.translate(sprite.x*2, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(  img,
                                (sprite.x-sprite.width/2),
                                (sprite.y-sprite.height/2),
                                sprite.width,
                                sprite.height
                )
                ctx.scale(-1, 1);
                ctx.translate(-sprite.x*2, 0);
                ctx.globalAlpha = 1;
                return;
            } else {
                var rad = 0;
            }
        }
        if(sprite.rotationStyle === 'fixed') {
            var rad = 0;
        }
        ctx.translate(sprite.x, sprite.y);
        ctx.rotate(rad);
        ctx.drawImage( img,
                    (-sprite.width / 2),
                    (-sprite.height / 2),
                    sprite.width,
                    sprite.height
        );
        ctx.rotate(-rad);
        ctx.translate(-sprite.x, -sprite.y);
        ctx.globalAlpha = 1;
    },

    drawBackdrop: function (src, x, y, width, height){
        if(src.includes('.')) {
            var img = this.loader.getImgFromCache(src);
            this.ctx.drawImage(img, (x||0), (y||0), (width||img.width), (height||img.height));
        } else if(src) {
            this.ctx.fillStyle = src;
            this.ctx.fillRect(0 ,0, this.settings.width, this.settings.height);
        }
    },
}

module.exports = Renderer;