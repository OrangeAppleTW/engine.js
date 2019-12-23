const DEFAULT_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEBLAEsAAD/2wBDAAQDAwQDAwQEBAQFBQQFBwsHBwYGBw4KCggLEA4RERAOEA8SFBoWEhMYEw8QFh8XGBsbHR0dERYgIh8cIhocHRz/2wBDAQUFBQcGBw0HBw0cEhASHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBwcHBz/wAARCAAyADIDAREAAhEBAxEB/8QAHAAAAgEFAQAAAAAAAAAAAAAABgcEAQIDBQgA/8QAORAAAQMCAwYCBQsFAAAAAAAAAQIDBAURACExBgcSIkFRFGETFjKBoRUjQmJykbGywdHSJERzk8P/xAAcAQABBQADAAAAAAAAAAAAAAAFAQIDBgcABAj/xAA/EQABAgQDAwUMCgMBAAAAAAABAgMABAURITFBBhJRFGGh0fAHFSJDUnGBkbGywfETMjM0NVNic5LSFyNyov/aAAwDAQACEQMRAD8AR1SqKx4mBT3Y/wAq8IlIakhQQpHFa2oINxmb9M++KU00iwcdB3L2uI9Qz86+lSpSRUjlASFhKgbEXI0I4ejUYwuHN6Ffp0tbLtNgsyGVcLiFNOJKSCMiOPLMDBxFGllAKCiQecdUZVMd0etMrUy8y2lScCClWH/uI43tVoJIEWnC4tcIcvbL6/cA+7DhRWPKPR1RErun1ZRuWm/Ur+8VTvarackMQEi97BDn6r9+E7yMeUr1jqh3+UKrq03/ABV/eKne5W7LSItOCVjhKQ2sC3Qe30wveVjyj0dUMHdOq2X0TfqV/eDyjVyZGgRpNcESOua8luPDYSoLJUQOa6jbUHuBne+WBD8q0pwplrndBJJyw9EaPTK1Oolm3q0Etl5SUoSkEKuo2F7qPG5GgzxNoJQ28QCGnbH6xwLi47yePRCj3kyZFP2qgS4ylx30RErbKDpzr0PUaj4YtFGbS5LKSoXBJ9gjEO6LMuytcYeYXurS2mxH/S+3PElxuDvFpwcZDMXaKOgBSCbJdAAGpOn5dNMMCnKc5Y4tno7dMdlbcntrKb7Vm51sYjRYHw4apyOFjC5kxnYry2XkKbdbVZSFCxBwbQtKkhSTcGMufl3Zd1TTySlSTYg5gxFw6IIY9FoLGy0RFer7ZS9YLhw1JspR6Eg9cvdqcBpqZXNr5LLZant2MabRKNLbPy4rdaHhD7NvW+hI8rX9OZ8KwjSxa1Mr+2NKlSli5mNBCMuBsekGQByx2lSyJaUWhHA+nCALNamaxtBKzMyfGIsBkkb4wHbGH6IyFAKSzynMZjT/AF4p1o9Gbx7fOEvvb4/WSMVkkmIlX3uLOnTX774tFF+7nz/ARhXdOAFWbAHix7y4CYsp6FIbfjuKbfbN0rGowVWhK0lCxcGKFKzTso6l9hRStJuCO3zhiOqh7x4HGktRtpI7dlJOQfSLdfv7kZDTAUfSU1yxxaPR26Y05aZTbWV32wG51sYjILA+HDVJzwxjFQ6BF2TgfL1fa+fSR4WIVDi4+hI6nr2HXth8xMrnF8nlctTEFJoUts6wKxXR4Y+o3rfiefoAxONgA/aHaCZtFPXKlLJJyQjiJS2nsL4JS0siXRuI+cUetVqZrEyZiZPmGiRwHxOsYtmr+sVHsLnxjNhbXnGFm/u7nmPsjmzn4xKfuI94R0M7KdDi/nWk5nl4SLeVsUiPUgA4iFHvYBTtBDSSOWGkAA+zZxzLFmon3dX/AEfYIwnun277NWHix7y4X+DEZzDMoNGi7I0/5erSlJkAWiw0qsu5Gp8/I6A99Ak1MKm18ll8tTGpUKkM7NsCuVe4X4tGSrka85GmSRiccIzPeD3kU1KmgmLXoaTZkXKVov01Nu56YjSF01yxxbVrwjsvrl9uJTeR/rm2hgm+ChfTm580nPA3hcS4z0KQ5HkNqbfaUULQoWKSOmDyVBYCkm4MZU+y4w4pl1JSpOBB0ibswAdpKMCbDxjNze1ucYhm/sHPMfZBLZ7Cryn7iPeEdEq9K6ouBtFlni9jv7sUXGPU+4kawnd7V/WGFxG58C3nw2y4l2+FsWqi/YK8/wABGDd078Wa/bHvriVRKHC2VgN12vJvIUAqLCtne2RP1vL6PXPRkzMrm18mljhqe3Yx2qLRJbZ+WFarafD8W3qToSPK1/RmcbAB9crsvaCa5Kluak8DYPK2OwGCctLIl0biPnFHrVamazNGZmT5hokcB2xiFElvQZDciOsofbN0LH0cSONpcSULFwYHy0y7Kupfl1FK0m4Ihiqbi7x6ap5pMeLtDDQniSk8IeSBa/4Z9CfPAQb9OXY4tno7dMaepuV22ld9Fm55sYjRY6ulORwtAdQ4rsXaulMvhTDqJrIWFAgo5xngpMqCpZZSbgpPsijUZh2XrUsy8khSXUAg533hHRDnh1OLPE1mSdR/LFJtHp8EgduqBis0eM3UGtpHYr8x1iOhpiK1H4uJwKXzAJvfPPMZWPlgjLTCy3yZCgkE3JJtwim1imS6J7vzMtqeU2kJShIKiVAqNyAOcWJwGedrKuvMbS7RVFyZKpNQKlEhDaYznCgDOwFumLBLrlGEbiFj1iMjrTG0FYmjMzUq5zDcVYDgMOnWNSvZqtINlUeopPYxlj9Mdjlcv+YPWIEDZ2rnKUc/grqjy9mK2i3FRqim+YvFWL/DHOWMfmD1iODZ2rnKUc/grqiRFo1fgPsyo1OqTTzZ4m3Ex1gg9xliNyZllpKFrSQecRPK0etyzqX5eWdSpOIIQrq+YhnQqd63uwKjLprlLq9PeZW8t5hTaHkpUL2JTbtroT1BwEW6JQLaQoKQoG1jleNVlpFW0K5eemmFMTLKklRKSAsAg4XzyNtU5YjGDD0zZzDyQD0uP54CbvNGl/S84i/+4P2F/irCCFRkPRFWfaT9lv8AKMKc4439SLkgGnJuL8364XSEV9aPM+yj/J/0H7Y5DeMVaWr+q5jyvEjPTlP7DCnKGpA3z24Rcz7bfkMvj+ww3SJTmY1d8JEl4//Z';

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

    getImgFromCache: function (path) {
        var img = this.images[path];
        
        if (!img) {
            img = new Image();
            img.src = path;
            img.onerror = function (e) { 
                console.error(this.src.split('/').pop() + ' 素材載入失敗，請確認是否填寫正確！ \n 圖片路徑：' + this.src);
                img.src = DEFAULT_IMAGE;
            }
            this.images[path] = img;

        }
        return img;
    },

    _loadImage: function (path) {
        var instance = this;
        var image = new Image();
        image.src = path;
        image.crossOrigin = 'anonymous';
        image.onload = function() {instance._loaded()};
        image.onerror = function (e) { 
            console.error(this.src.split('/').pop() + ' 素材載入失敗，請確認是否填寫正確！ \n 圖片路徑：' + this.src);
            img.src = DEFAULT_IMAGE;
        }
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
    _xhrLoad: function (url, onload) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            onload(xhr);
        };
        xhr.onerror = function () {
            console.error(xhr);
        };
        xhr.send();
    }

}

module.exports = Loader;
