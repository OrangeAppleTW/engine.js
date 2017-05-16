function Sound (sounds, debugMode){
    this.sounds = sounds;
    this.playing = [];
    this.muted = false;
    this.volume = 1;
}

Sound.prototype = {

    play: function(url, loop) {
        var audio;
        if(this.sounds[url]) {
            audio = this.sounds[url].cloneNode();
            this.playing.push(audio);
            audio.play();
        } else {
            audio = new Audio(url);
            this.sounds[url] = audio;
            this.playing.push(audio);
            audio.play();
        }
        audio.loop = loop;
        audio.muted = this.muted;
        audio.volume = this.volume;
        return audio;
    },

    stop: function() {
        for(var i=0; i< this.playing.length; i++) {
            this.playing[i].pause();
        }
        this.playing = [];
    },

    mute: function(bool) {
        this.muted = bool;
        for(var i=0; i< this.playing.length; i++) {
            this.playing[i].muted = bool;
        }
    },

    setVolume: function(v) {
        this.volume = v;
        for(var i=0; i< this.playing.length; i++) {
            this.playing[i].volume = v;
        }
    },

    each: function(fn) {
        for(var i=0; i< this.playing.length; i++) {
            fn(this.playing[i]);
        }
    }
}

module.exports = Sound;