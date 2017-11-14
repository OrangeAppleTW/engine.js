function Camera (settings) {
    this.x = settings.width/2;
    this.y = settings.height/2;
    this.scale = 1;
}

Camera.prototype.moveTo = function (target) {
    this.x = target.x;
    this.y = target.y;
}

module.exports = Camera;