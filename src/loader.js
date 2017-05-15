function Loader () {
    this.loaded = 0;
}

Loader.prototype.preload = function (paths, completeFunc, progressFunc) {
    var instance = this;
    var sounds = {};
    for(var i=0; i<paths.length; i++) {
        var path = paths[i];
        var ext = path.split('.').pop();
        if(['mp3', 'ogg', 'wav'].includes(ext)) {
            var audio = new Audio();
            audio.src = path;
            audio.addEventListener('canplaythrough', function() {
                instance.loaded += 1;
                if(progressFunc) progressFunc(instance.loaded);
                if(instance.loaded >= paths.length) {
                    if(completeFunc) completeFunc();
                }
            });
            sounds[path] = audio;
        }
    }
    return sounds;
}

module.exports = Loader;
