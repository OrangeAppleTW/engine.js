function Sound (loader, debugMode){
    this.loader = loader;
    this.sounds = loader.sounds;
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
            // 用 preload 載入音檔 src 作為 cache
            this.loader.preload([url]);
            audio = this.sounds[url];
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