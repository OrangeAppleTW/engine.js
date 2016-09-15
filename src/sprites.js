function Sprites(){}

Sprites.prototype.each = function(func){
    for(let key in this){
        if (this[key].constructor.name === "Sprite") {
            func.call(this[key],this[key]);
        } else if (this[key] instanceof Array) {
            var instances = this[key];
            for(let i=0; i<instances.length; i++){
                var instance = instances[i];
                func.call(instance,instance);
            }
        }
    }
}

Sprites.prototype.clear = function(){
    for(let key in this){
        delete this[key];
    }
};

module.exports = Sprites;