var loader = new(require('./loader'));

function Sound (sounds, debugMode){
    this.sounds = sounds;
    this.playing = [];
}

Sound.prototype = {
    
    preload: function (paths, completeFunc, progressFunc) {
        this.sounds = loader.preload(paths, completeFunc, progressFunc);
    },

    play: function(url) {
        if(this.sounds[url]) {
            var audio = this.sounds[url].cloneNode();
            this.playing.push(audio);
            audio.play();
        } else {
            var audio = new Audio(url);
            this.sounds[url] = audio;
            this.playing.push(audio);
            audio.play();
        }
    },

    stop: function() {
        for(var i=0; i< this.playing.length; i++) {
            this.playing[i].pause();
        }
        this.playing = [];
    }
}

module.exports = Sound;