var util = {

    isNumeric: function(n){
        return !isNaN(parseFloat(n)) && isFinite(n);
    },

    radToDegree: function(rad){
        rad = rad%(Math.PI*2);
        if(rad<0) rad += Math.PI*2;
        return rad*180/Math.PI;
    },

    degreeToRad: function(degree){
        degree = degree%360;
        if(degree<0) degree += 360;
        return degree/180*Math.PI;
    },
    
    distanceBetween: function(fromX, fromY, toX, toY){
        return Math.sqrt(Math.pow(fromX-toX, 2) + Math.pow(fromY-toY, 2));
    },

    vectorToDegree: function (vectorX, vectorY) {
        var rad = Math.atan2(vectorX, -vectorY); // 這裡的 vectorY 和數學坐標是反過來的
        return this.radToDegree(rad)
    },

    position: function (args) {
        if(this.isNumeric(args[0].x) && this.isNumeric(args[0].y)) {
            return args[0];
        } else if (this.isNumeric(args[0]) && this.isNumeric(args[1])) {
            return { x: args[0], y: args[1] }
        } else {
            throw "請傳入角色(Sprite, Cursor)或是 X, Y 座標值"
        }
    }
};


module.exports = util;