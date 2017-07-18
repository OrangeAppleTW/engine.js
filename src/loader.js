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

            if(['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(ext)) {
                this._loadImage(path);
            }
            if(['mp3', 'ogg', 'wav', 'midi'].includes(ext)) {
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
            this._loadFromAjax(path, function(data){
            instance._convertBinToBase64(data.response, function(base64) {
               audio.src = base64;
            });
        });
        audio.addEventListener('canplaythrough', function() {
            instance._loaded()
        });
        
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
    },
    _loadFromAjax: function (url, callback) {
        var xhr;
        
        if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
        else {
            var versions = ["MSXML2.XmlHttp.5.0", 
                            "MSXML2.XmlHttp.4.0",
                            "MSXML2.XmlHttp.3.0", 
                            "MSXML2.XmlHttp.2.0",
                            "Microsoft.XmlHttp"]

            for(var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch(e){}
            } // end for
        }
        
        xhr.onreadystatechange = ensureReadiness;
        
        function ensureReadiness() {
            if(xhr.readyState < 4) {
                return;
            }
            
            if(xhr.status !== 200) {
                return;
            }

            // all is well  
            if(xhr.readyState === 4) {
                callback(xhr);
            }           
        }
        
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.send('');
    },
    _convertBinToBase64: function getData(audioFile, callback) {
        var reader = new FileReader();
        reader.onload = function(event) {
            callback(event.target.result);
        };
        reader.readAsDataURL(audioFile);
    }

}

module.exports = Loader;
