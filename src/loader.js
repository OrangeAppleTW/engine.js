function Loader () {
    this.loaded = 0;
    this.paths = [];
    this.sounds = {};
    this.images = {};
    this.completeFunc;
    this.progressFunc;
}

Loader.prototype = {

    preload: function (paths, completeFunc, progressFunc) {

        if(paths.length === 0) return completeFunc();

        this.paths = paths;
        this.completeFunc = completeFunc;
        this.progressFunc = progressFunc;

        for(var i=0; i<paths.length; i++) {
            var path = paths[i];
            var ext = path.split('.').pop();

            if(['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
                this._loadImage(path);
            }
            if(['mp3', 'ogg', 'wav'].includes(ext)) {
                this._loadSound(path);
            }
        }
    },

    _loadImage: function (path) {
        var instance = this;
        var image = new Image();
        image.src = path;
        image.onload = function() {instance._loaded()};
        this.images[path] = image;
    },

    _loadSound: function (path) {
        var instance = this;
        var audio = new Audio();
        audio.src = path;
        audio.addEventListener('canplaythrough', function() {instance._loaded()});
        this.sounds[path] = audio;
    },

    _loaded: function () {
        this.loaded += 1;
        if(this.progressFunc) {
            this.progressFunc(this.loaded, this.paths.length);
        }
        if(this.loaded === this.paths.length && this.completeFunc) {
            this.completeFunc();
        }
    }

}

module.exports = Loader;
