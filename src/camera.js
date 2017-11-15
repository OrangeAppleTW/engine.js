function Camera (settings) {
    this.x = settings.width/2;
    this.y = settings.height/2;
    this.scale = 1;
    this.settings = settings;
}

Camera.prototype.moveTo = function (target) {
    this.x = target.x;
    this.y = target.y;
}

Camera.prototype.offsetCamera = function (pos) {
    return {
        x: pos.x + this.x - this.settings.width/2,
        y: pos.y + this.y - this.settings.height/2   
    }
}

module.exports = Camera;