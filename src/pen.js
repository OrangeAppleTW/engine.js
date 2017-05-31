function Pen (ctx) {
    this.ctx = ctx;
    this.size = 1;
    this.color = 'black';
    this.fill = null;
    this.shapes = [];
}

Pen.prototype = {

    draw: function () {

        var s;
        var ctx = this.ctx;

        for(var i=0; i<this.shapes.length; i++) {
            
            s = this.shapes[i];
            ctx.lineWidth = s.size;
            ctx.strokeStyle = s.color;
            ctx.fillStyle = s.fill;

            ctx.beginPath();

            if (s.type == 'text') {
                ctx.textBaseline = "top";
                ctx.font = s.size + "px " + s.font;
                ctx.fillText(s.t, s.x, s.y);
            }
            else if (s.type == 'line') {
                ctx.moveTo(s.x1,s.y1);
                ctx.lineTo(s.x2,s.y2);
            }
            else if (s.type == 'circle') {
                ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
            }
            else if (s.type == 'triangle') {
                ctx.moveTo(s.x1, s.y1);
                ctx.lineTo(s.x2, s.y2);
                ctx.lineTo(s.x3, s.y3);
            }
            else if (s.type == 'rect') {
                ctx.moveTo(s.x, s.y);
                ctx.lineTo(s.x + s.w, s.y);
                ctx.lineTo(s.x + s.w, s.y + s.h);
                ctx.lineTo(s.x, s.y + s.h);
            }
            else if (s.type == 'polygon') {
                ctx.moveTo(s.points[0],s.points[1]);
                for(var i=2; i<s.points.length; i+=2) {
                     ctx.lineTo(s.points[i],s.points[i+1]);
                }
            }

            ctx.closePath();

            if(s.size) ctx.stroke();
            if(s.fill) ctx.fill();
        }

        this.shapes = [];
    },

    drawText: function (text, x, y, color, size, font) {
        var s = {};
        s.t = text;
        s.x = x;
        s.y = y;
        s.fill = color;
        s.size = size;
        s.font = font || 'Arial';
        s.type = 'text';
        this.shapes.push(s);
    },
    
    drawLine: function (x1, y1, x2, y2) {
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.type = 'line';
        this._addShape(s);
    },

    drawCircle: function (x, y ,r) {
        var s = {};
        s.x = x;
        s.y = y;
        s.r = r;
        s.type = 'circle';
        this._addShape(s);
    },

    drawTriangle: function (x1, y1, x2, y2, x3, y3) {
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.x3 = x3;
        s.y3 = y3;
        s.type = 'triangle';
        this._addShape(s);
    },

    drawRect: function (x, y, width, height) {
        var s = {};
        s.x = x;
        s.y = y;
        s.w = width;
        s.h = height;
        s.type = 'rect';
        this._addShape(s);
    },
    
    drawPolygon: function () {
        var s = {};
        s.points = Array.prototype.slice.call(arguments);
        s.type = 'polygon';
        this._addShape(s);
    },

    _addShape: function (s) {
        s.size = this.size;
        s.color = this.color;
        s.fill = this.fill;
        this.shapes.push(s);
    }

}

module.exports = Pen;