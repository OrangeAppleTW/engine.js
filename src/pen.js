function Pen (ctx) {
    this.ctx = ctx;
    this.shapes = [];
}

Pen.prototype = {

    draw: function () {

        var s;
        var ctx = this.ctx;

        for(var i=0; i<this.shapes.length; i++) {
            var s = this.shapes[i];
            if (s.type == 'text') {
                ctx.textBaseline = "top";
                ctx.font = s.size + "px " + s.font;
                ctx.fillStyle = s.color;
                ctx.fillText(s.t, s.x, s.y);
            }
            else if (s.type == 'line') {
                ctx.beginPath();
                ctx.strokeStyle = s.color;
                ctx.lineWidth = s.width;
                ctx.moveTo(s.x1,s.y1);
                ctx.lineTo(s.x2,s.y2);
                ctx.stroke();
                ctx.closePath();
            }
            else if (s.type == 'circle') {
                ctx.beginPath();
                ctx.fillStyle = s.color;
                ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
                ctx.fill();
                ctx.closePath();
            }
            else if (s.type == 'triangle') {
                ctx.beginPath();
                ctx.fillStyle = s.color;
                ctx.moveTo(s.x1,s.y1);
                ctx.lineTo(s.x2,s.y2);
                ctx.lineTo(s.x3,s.y3);
                ctx.closePath();
                ctx.fill();
            }
            else if (s.type == 'rect') {
                ctx.fillStyle = s.color;
                ctx.fillRect(s.x, s.y, s.w, s.h);
            }
            else if (s.type == 'polygon') {
                ctx.beginPath();
                ctx.fillStyle = s.color;
                ctx.moveTo(s.points[0],s.points[1]);
                for(var i=2; i<s.points.length; i+=2) {
                     ctx.lineTo(s.points[i],s.points[i+1]);
                }
                ctx.closePath();
                ctx.fill();
            }
        }

        this.shapes = [];
    },

    drawText: function (text, x, y, color, size, font) {
        var s = {};
        s.t = text;
        s.x = x;
        s.y = y;
        s.color = color || 'black';
        s.size = size || 16;
        s.font = font || 'Arial';
        s.type = 'text';
        this.shapes.push(s);
    },
    
    drawLine: function (x1, y1, x2, y2, color, width) {
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.color = color;
        s.width = width;
        s.type = 'line';
        this.shapes.push(s);
    },

    drawCircle: function (x, y ,r, color) {
        var s = {};
        s.x = x;
        s.y = y;
        s.r = r;
        s.color = color;
        s.type = 'circle';
        this.shapes.push(s);
    },

    drawTriangle: function (x1, y1, x2, y2, x3, y3, color) {
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.x3 = x3;
        s.y3 = y3;
        s.color = color;
        s.type = 'triangle';
        this.shapes.push(s);
    },

    drawRect: function (x, y, width, height, color) {
        var s = {};
        s.x = x;
        s.y = y;
        s.w = width;
        s.h = height;
        s.color = color;
        s.type = 'rect';
        this.shapes.push(s);
    },
    
    drawPolygon: function (points, color) {
        var s = {};
        s.points = points;
        s.color = color;
        s.type = 'polygon';
        this.shapes.push(s);
    }
}

module.exports = Pen;