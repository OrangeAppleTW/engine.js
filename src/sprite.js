var util = require("./util");

// @TODO: 客製化特征
function Sprite(args) {
    this.x = args.x;
    this.y = args.y;
    this.direction = args.direction;
    this.scale = args.scale; // @TODO
    this.costumes = [].concat(args.costumes); // Deal with single string
    this.currentCostumeId = 0; // Deal with single string
    // this.deleted = args.deleted; // @TODO
    this.width = 1;
    this.height = 1;
    this.hidden = args.hidden;
}

Sprite.new = function(args){
    return new Sprite(args);
};

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
    var crossX = crossY = false;
    if( arguments[0] instanceof Sprite ){
        var target = arguments[0];
        crossX = (this.x+this.width/2)>(target.x-target.width/2) && (target.x+target.width/2)>(this.x-this.width/2);
        crossY = (this.y+this.height/2)>(target.y-target.height/2) && (target.y+target.height/2)>(this.y-this.height/2);
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ) {
        var targetX = arguments[0],
            targetY = arguments[1];
        crossX = (this.x+this.width/2)>targetX && targetX>(this.x-this.width/2);
        crossY = (this.y+this.height/2)>targetY && targetY>(this.y-this.height/2);
    } else {
        throw "請傳入角色(Sprite)或是 X, Y 坐標值";
    }
    return (crossX && crossY);
};

Sprite.prototype.distanceTo = function(){
    if( util.isNumeric(arguments[0].x) && util.isNumeric(arguments[0].y) ){
        return util.distanceBetween( this, arguments[0] );
    } else if ( util.isNumeric(arguments[0]) && util.isNumeric(arguments[1]) ){
        return util.distanceBetween( this.x, this.y, arguments[0], arguments[1] );
    }
}

module.exports = Sprite;