function Loader () {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
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
        image.onerror = function() {
            console.error("無法載入 \"" + path + "\", 請檢查素材是否存在或名稱是否輸入正確。");
        };
        image.src = path;
        image.crossOrigin = 'anonymous';
        image.onload = function() {instance._loaded()};
        this.images[path] = image;
    },

    _loadSound: function (path) {
        var _this = this;
        this._xhrLoad(path, function(xhr){
            var data = xhr.response;
            _this.context.decodeAudioData(data, function(buffer) {
                _this.sounds[path] = buffer;    
                _this._loaded();
            }); 
        }, function() {
            console.error("無法載入 \"" + path + "\", 請檢查素材是否存在或名稱是否輸入正確。");
        });
    },
    _loaded: function () {
        this.loaded += 1;
        if(this.progressFunc) {
            this.progressFunc(this.loaded, this.paths.length);
        }
        if(this.loaded >= this.paths.length && this.completeFunc) {
            this.completeFunc();
        }
    },
    _xhrLoad: function (url, onload, onerror) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    onload(xhr);
                } else {
                    onerror(xhr);
                }
            }

            
        };
        xhr.onerror = function () {
            onerror(xhr);
        };
        xhr.send();
    }

}

module.exports = Loader;
