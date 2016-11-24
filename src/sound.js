function Sound(debugMode){
    this.sounds = [];
    // this.generate = function(url){
    //     return (function(){
    //         var sound = new Audio(url),
    //             obj = {};
    //         sounds.push(sound);
    //         obj.play = function(url){
    //             sound.load();
    //             sound.play();
    //         };
    //         obj.stop = function(){
    //             sound.pause();
    //             sound.currentTime = 0;
    //         };
    //         return obj;
    //     })()
    // }
    this.play = function(url){
        var sounds = this.sounds;
        return (function(){
            var sound = new Audio(url);
            var index = sounds.length;
            sounds.push(sound);
            sound.play();
            sound.addEventListener('ended', function(){
                sounds[index] = null;
                sound = null;
            });
            return sound;
        })();
    }
    this.stop = function(){
        for(var i=0; i<this.sounds.length; i++){
            if(this.sounds[i]){
                this.sounds[i].pause();
            }
        }
    }
}

module.exports = Sound;