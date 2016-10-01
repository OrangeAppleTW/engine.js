var util = require("./util");
var hitCanvas = document.createElement('canvas'),
    hitTester = hitCanvas.getContext('2d');
    // document.body.appendChild(hitCanvas);

// @TODO: 客製化特征
function Sprite(args, eventList, settings, renderer) {
    this.x = args.x;
    this.y = args.y;
    this.direction = args.direction || 0;
    this.scale = args.scale || 1;
    this.costumes = [].concat(args.costumes); // Deal with single string
    this.currentCostumeId = 0;
    this.width = 1;
    this.height = 1;
    this.hidden = args.hidden;

    this._onTick = null;
    this._deleted = false;

    this._eventList = eventList;
    this._settings = settings;
    this._renderer = renderer;
}

Sprite.prototype.moveTo = function(x, y){
    this.x = x;
    this.y = y;
};

Sprite.prototype.move = function(x, y){
    this.x += x;
    this.y += y;
};

Sprite.prototype.stepForward = function(distance){
    var rad = util.degreeToRad(this.direction)
    this.x += Math.cos(rad)*distance;
    this.y -= Math.sin(rad)*distance;
};

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
    rad = Math.atan2(-offsetY, offsetX); // 這裡的 offsetY 和數學坐標是反過來的
    this.direction = util.radToDegree(rad);
    // console.log(this.direction);
}

Sprite.prototype.touched = function(){
    // 由於效能考量，先用成本最小的「座標範圍演算法」判斷是否有機會「像素重疊」
    var crossX = crossY = false;
    if( arguments[0] instanceof Sprite ){
        var target = arguments[0];
        crossX = (this.x+this.width/2)>(target.x-target.width/2) && (target.x+target.width/2)>(this.x-this.width/2);
        crossY = (this.y+this.height/2)>(target.y-target.height/2) && (target.y+target.height/2)>(this.y-this.height/2);
    } else if ( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ) {
        var targetX = arguments[0].x,
            targetY = arguments[0].y;
        crossX = (this.x+this.width/2)>targetX && targetX>(this.x-this.width/2);
        crossY = (this.y+this.height/2)>targetY && targetY>(this.y-this.height/2);
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
        var targetX = arguments[0],
            targetY = arguments[1];
        crossX = (this.x+this.width/2)>targetX && targetX>(this.x-this.width/2);
        crossY = (this.y+this.height/2)>targetY && targetY>(this.y-this.height/2);
    } else {
        throw "請傳入角色(Sprite)、{x:x, y:y}，或是 X, Y 坐標值";
    }

    // 如果經過「座標範圍演算法」判斷，兩者有機會重疊，則進一步使用「像素重疊演算法」進行判斷
    if (crossX && crossY) {
        var renderer = this._renderer;
        var settings = this._settings;
        hitCanvas.width = settings.width;
        hitCanvas.height = settings.height;

        hitTester.globalCompositeOperation = 'source-over';
        hitTester.drawImage(    renderer.getImgFromCache(this.getCurrentCostume()),
                                this.x-this.width/2, this.y-this.height/2,
                                this.width, this.height );

        hitTester.globalCompositeOperation = 'source-in';
        if( arguments[0] instanceof Sprite ){
            var target = arguments[0];
            hitTester.drawImage(    renderer.getImgFromCache(target.getCurrentCostume()),
                                    target.x-target.width/2, target.y-target.height/2,
                                    target.width*target.scale, target.height*target.scale );
        } else if ( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ) {
            hitTester.fillRect(arguments[0].x,arguments[0].y,1,1);
        } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
            hitTester.fillRect(arguments[0],arguments[1],1,1);
        } else {
            return false
        }

        // 只要對 sprite 的大小範圍取樣即可，不需對整張 canvas 取樣
        var aData = hitTester.getImageData(this.x-this.width/2, this.y-this.height/2, this.width, this.height).data;
        var pxCount = aData.length;
        for (var i = 0; i < pxCount; i += 4) {
            if (aData[i+3] > 0) {
                return true;
            }
        }
    }
    return false;
};

Sprite.prototype.distanceTo = function(){
    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
        return util.distanceBetween( this, arguments[0] );
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
    }
};

Sprite.prototype.always = Sprite.prototype.forever = function(func){
    this._onTick = func;
};

Sprite.prototype.when = Sprite.prototype.on = function(){
    var event = arguments[0],
        target, handler;
    if(event=="hover" || event=="click"){
        target = this;
        handler = arguments[1];
    } else if (event=="touch"){
        if(Array.isArray(arguments[1])){
            target = [this].concat(arguments[1]);
        } else {
            target = [this].concat([arguments[1]]);
        }
        handler = arguments[2];
    } else {
        console.log('Sprite.on() does only support "click", "hover" and "touch" events');
        return false;
    }
    this._eventList.register(event, target, handler);
};

Sprite.prototype.destroy = function(){
    this._deleted = true;
};

Sprite.prototype.getCurrentCostume = function(){
    var id = this.currentCostumeId;
    return this.costumes[id];
};

module.exports = Sprite;