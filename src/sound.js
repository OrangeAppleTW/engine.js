var SoundNode = require('./sound-node');

function Sound (loader) { 
    this.context = new (window.AudioContext || window.webkitAudioContext)();    
    this.soundNodes = [];
    
    this.loader = loader;
    this.sounds = loader.sounds;
    this.muted = false;
}

Sound.prototype = {
    play: function(url, isLoop) {
        isLoop = (typeof isLoop !== 'undefined') ?  isLoop : false;        
        var soundNode = new SoundNode(this.context);

        if(this.sounds[url]) {
            var bufferData = this.sounds[url];
            
            soundNode.setBufferData(bufferData);
            soundNode.setLoop(isLoop);

            this.soundNodes.push(soundNode);
            soundNode.play();            
        } else {
            var _this = this;
            this.loader._xhrLoad(url, function(xhr) {
                var data = xhr.response;
                _this.context.decodeAudioData(data, function(bufferData) {
                    // set cache
                    _this.sounds[url] = bufferData;    

                    // play sound
                    soundNode.setBufferData(bufferData);
                    soundNode.setLoop(isLoop);
                    _this.soundNodes.push(soundNode);
                    soundNode.play();
                }); 
            });
        }

        return soundNode;
    },
    setVolume: function(volume) {
        if (volume < 0) {
            return console.error("無效的音量值");
        }
        for(let i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.setVolume(volume);
        }
    },
    mute: function(isMute) {
        for(let i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.mute(isMute);
        }
    },
    pause: function() {
        this.context.suspend();
    },
    resume: function() {
        this.context.resume();
    },
    stop: function() {
        for(let i = 0; i < this.soundNodes.length; i++) {
            var soundNode = this.soundNodes[i];
            soundNode.stop();
        }
    }
}

module.exports = Sound;