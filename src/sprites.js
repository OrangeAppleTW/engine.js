function Sprites(){
    this._sprites = [];
}

Sprites.prototype.runOnTick = function(){
    this.each(function(){
        this.update();
    });
}

Sprites.prototype.each = function(func){
    var sprites = this._sprites;
    for(var i=0; i<sprites.length; i++){
        func.call(sprites[i],sprites[i]);
    }
}

Sprites.prototype.removeDeletedSprites = function(){
    var sprites = this._sprites;
    for(var i=0; i<sprites.length; i++){
        if(sprites[i]._deleted){
            sprites.splice(i,1);
        }
    }
}

Sprites.prototype.clear = function(){
    this._sprites = [];
};

module.exports = Sprites;