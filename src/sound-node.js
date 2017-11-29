function SoundNode(context) {
    this.source = null;
    this.gainNode = context.createGain();    
    this.context = context;
    
    this.isLoop = false;
    this.bufferData = null;
    this.volume = 1;

    // gainNode connect to context
    this.gainNode.connect(context.destination);
    
}

SoundNode.prototype = {
    setVolume: function(volume) {
        if (volume < 0) {
            return console.error("無效的音量值");
        }
        this.volume = volume;
        this.gainNode.gain.value = volume;
    },
    setBufferData: function(bufferData) {
        this.bufferData = bufferData;
    },
    setLoop: function (isLoop) {
        this.isLoop = isLoop;
    },
    mute: function(isMute) {
        if(isMute) {
            this.gainNode.gain.value = 0;
        } else {
            this.gainNode.gain.value = this.volume;
        }
    },
    pause: function() {
        this.source.playbackRate.value = Number.MIN_VALUE;        
    },
    resume: function () {
        this.source.playbackRate.value = 1;
    },
    play: function() {
        this.source = this.context.createBufferSource();
        this.source.buffer = this.bufferData;
        this.source.loop = this.isLoop;
        this.source.connect(this.gainNode);
        this.source.start(0);
    },
    stop: function() {
        this.source.stop();
    }
}




module.exports = SoundNode;