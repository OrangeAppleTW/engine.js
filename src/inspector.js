function Inspector(){
    this.fps = 0;
    this._lastFrameUpdatedTime = (new Date()).getTime();
}

Inspector.prototype.updateFPS = function(){
    var now = (new Date()).getTime();
    this.fps = Math.round( 1000/(now-this._lastFrameUpdatedTime) );
    this._lastFrameUpdatedTime = now;
}

module.exports = Inspector;