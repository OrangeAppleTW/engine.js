function Sprites(){}

Sprites.prototype.runTickFunc = function(){
    this.each(function(){
        if(this._onTickFunc){ this._onTickFunc(); }
    });
}

Sprites.prototype.each = function(func){
    for(var key in this){
        if (this[key].constructor.name === "Sprite") {
            func.call(this[key],this[key]);
        } else if (this[key] instanceof Array) {
            var instances = this[key];
            for(var i=0; i<instances.length; i++){
                var instance = instances[i];
                func.call(instance,instance);
            }
        }
    }
}

Sprites.prototype.removeDeletedSprites = function(){
    for(var key in this){
        if (this[key].constructor.name === "Sprite") {
            if(this[key]._deleted){ delete this[key]; }
        } else if (this[key] instanceof Array) {
            var instances = this[key];
            for(var i=0; i<instances.length; i++){
                if(instances[i]._deleted){
                    instances.splice(i,1);
                }
            }
        }
    }
}

Sprites.prototype.clear = function(){
    for(var key in this){
        delete this[key];
    }
};

module.exports = Sprites;