var SoundNode = require('./sound-node');

function Sound (loader, debugMode) { 
    this.context = new (window.AudioContext || window.webkitAudioContext)();    
    this.soundNodes = [];
    
    this.loader = loader;
    this.sounds = loader.sounds;
    this.isStop = false;
    this.muted = false;
}

Sound.prototype = {
    play: function(url) {
        var soundNode = new SoundNode(this.context);

        if(this.sounds[url]) {
            var bufferData = this.sounds[url];
            
            soundNode.setBufferData(bufferData);
            soundNode.setLoop(isLoop);

            this.soundNodes.push(soundNode);
            soundNode.play();
        } else {
            var _this = this;
            this.loader.preload([url], function() {
                var bufferData = _this.sounds[url];
                
                soundNode.setBufferData(bufferData);
                soundNode.setLoop(isLoop);
                
                _this.soundNodes.push(soundNode);
                soundNode.play();
            });
        }

        return soundNode;
    },
    mute: function(isMute) {
        for(var i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.mute(isMute);
        }
    },
    pause: function() {
        this.context.suspend();
    },
    resume: function() {
        this.context.resume();
    }
}

module.exports = Sound;