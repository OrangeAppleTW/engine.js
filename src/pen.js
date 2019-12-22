function Pen (canvas) {
    this.ctx = canvas.getContext('2d');
    this.size = 1;
    this.color = 'black';
    this.fillColor = null;
    this.drawingMode = "onTick"; // ["onTick", "instant"]
    this.shapes = [];
    this.texts = [];
}

Pen.prototype = {

    drawShapes: function () {

        var s;
        var ctx = this.ctx;

        for(var i=0; i<this.shapes.length; i++) {
            
            s = this.shapes[i];
            ctx.lineWidth = s.size;
            ctx.strokeStyle = s.color;
            ctx.fillStyle = s.fillColor;

            if (s.type == 'line') {
                this._drawLine(s.x1,s.y1,s.x2,s.y2);
            }
            else if (s.type == 'circle') {
                this._drawCircle(s.x, s.y, s.r);
            }
            else if (s.type == 'triangle') {
                this._drawTriangle(s.x1, s.y1, s.x2, s.y2, s.x3, s.y3);
            }
            else if (s.type == 'rect') {
                this._drawRect(s.x, s.y, s.w, s.h);
            }
            else if (s.type == 'polygon') {
                this._drawPolygon.apply(this, s.points);
            }
        }
        this.shapes=[];
    },

    drawTexts: function () {
        for(var i=0; i<this.texts.length; i++) {
            t = this.texts[i];
            this._drawText(t.text, t.x, t.y, t.color, t.size, t.font);
        }
        this.texts=[];
    },

    drawText: function (text, x, y, color ,size, font) {
        x = x == undefined ? 10 : x;
        y = y == undefined ? 10 : y;
        color = color || 'black';
        size = size || 16;
        font = font || 'Arial';

        // 如果不是 autoRender 模式，直接畫
        if (this.drawingMode=="instant") return this._drawText(text, x, y, color ,size, font);
        // 如果是 autoRener，存起來
        this._addText({
            text: text,
            x: x,
            y: y,
            color: color,
            size: size,
            font: font
        });
    },
    
    drawLine: function (x1, y1, x2, y2) {
        if (this.drawingMode=="instant") return this._drawLine(x1, y1, x2, y2);
        var s = {};
        s.x1 = x1;
        s.y1 = y1;
        s.x2 = x2;
        s.y2 = y2;
        s.type = 'line';
        this._addShape(s);
    },

    drawCircle: function (x, y ,r) {
        if (this.drawingMode=="instant") return this._drawCircle(x, y ,r);
        var s = {};
        s.x = x;
        s.y = y;
        s.r = r;
        s.type = 'circle';
        this._addShape(s);
    },

    drawTriangle: function (x1, y1, x2, y2, x3, y3) {
        if (this.drawingMode=="instant") return this._drawTriangle(x1, y1, x2, y2, x3, y3);
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
        if (this.drawingMode=="instant") return this._drawRect(x, y, width, height);
        var s = {};
        s.x = x;
        s.y = y;
        s.w = width;
        s.h = height;
        s.type = 'rect';
        this._addShape(s);
    },
    
    drawPolygon: function () {
        if (this.drawingMode=="instant") return this._drawPolygon.apply(this, arguments);
        var s = {};
        s.points = Array.prototype.slice.call(arguments);
        s.type = 'polygon';
        this._addShape(s);
    },

    _drawText: function (text, x, y, color ,size, font) {
        if(this.drawingMode=="instant") this._setPenAttr();
        this.ctx.textBaseline = "top";
        this.ctx.font = size + "px " + font;
        this.ctx.fillStyle = color;
        this.ctx.fillText(text, x, y);
    },

    _drawLine: function (x1, y1, x2, y2) {
        if(this.drawingMode=="instant") this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawCircle: function (x, y ,r) {
        if(this.drawingMode=="instant") this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawTriangle: function (x1, y1, x2, y2, x3, y3) {
        if(this.drawingMode=="instant") this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawRect: function (x, y, w, h) {
        if(this.drawingMode=="instant") this._setPenAttr();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x+w, y);
        this.ctx.lineTo(x+w, y+h);
        this.ctx.lineTo(x, y+h);
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _drawPolygon: function () {
        if(this.drawingMode=="instant") this._setPenAttr();
        var points = Array.prototype.slice.call(arguments);
        this.ctx.beginPath();
        this.ctx.moveTo(points[0],points[1]);
        for(var i=2; i<points.length; i+=2) {
                this.ctx.lineTo(points[i],points[i+1]);
        }
        this.ctx.closePath();
        if(this.size) this.ctx.stroke();
        if(this.fillColor) this.ctx.fill();
    },

    _setPenAttr: function () {
        this.ctx.lineWidth = this.size;
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.fillColor;
    },

    _addShape: function (s) {
        s.size = this.size;
        s.color = this.color;
        s.fillColor = this.fillColor;
        this.shapes.push(s);
    },

    _addText: function (t) {
        this.texts.push(t);
    }

}

module.exports = Pen;