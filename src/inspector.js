var inspector = {
    fps:0,
    lastFrameUpdatedTime:(new Date()).getTime(),
    updateFPS: function(){
        var now = (new Date()).getTime();
        this.fps = Math.round( 1000/(now-this.lastFrameUpdatedTime) );
        this.lastFrameUpdatedTime = now;
    }
};

module.exports = inspector;