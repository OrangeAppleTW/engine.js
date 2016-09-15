var util = {};

util.isNumeric = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}
util.radToDegree = function(rad){
    if(rad<0){rad += 2 * Math.PI;}
    return rad*180/Math.PI;
}
util.degreeToRad = function(degree){
    return degree/180*Math.PI
}
util.distanceBetween = function(){
    var from = {x:0,y:0},
        to   = {x:0,y:0};
    if( util.isNumeric(arguments[0].x) &&
        util.isNumeric(arguments[0].y) &&
        util.isNumeric(arguments[1].x) &&
        util.isNumeric(arguments[1].y)
    ){
        from.x = arguments[0].x;
        from.y = arguments[0].y;
        to.x = arguments[1].x;
        to.y = arguments[1].y;
    } else if (
        util.isNumeric(arguments[0]) &&
        util.isNumeric(arguments[1]) &&
        util.isNumeric(arguments[2]) &&
        util.isNumeric(arguments[3])
    ) {
        from.x = arguments[0];
        from.y = arguments[1];
        to.x   = arguments[2];
        to.y   = arguments[3];
    } else {
        throw "請傳入角色(Sprite)或是 X, Y 坐標值";
    }
    return Math.sqrt( Math.pow(to.x-from.x,2) + Math.pow(to.y-from.y,2) )
}

module.exports = util;