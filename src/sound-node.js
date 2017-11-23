function SoundNode(context) {
    this.volume = 1;
    this.source = context.createBufferSource();

    // Connect: Source <-> Gain <-> Context
    this.gainNode = context.createGain();
    this.source.connect(this.gainNode);
    this.gainNode.connect(context.destination);

}

SoundNode.prototype = {
    setVolume: function(volume) {
        if (volume < 0 || volume > 1) {
            return console.error("無效的音量值");
        }
        this.volumne = volumne;
        this.gainNode.gain.value = volume;
    },
    setBufferData: function(bufferData) {
        this.source.buffer = bufferData;        
    },
    setLoop: function (isLoop) {
        this.this.source.loop;
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
        this.source.start(0);
    }
}




module.exports = SoundNode;