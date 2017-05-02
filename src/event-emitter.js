function EventEmitter () {
    this.events = {}
}

EventEmitter.prototype.on = function (event, fn, context) {
    if(context) fn = fn.bind(context);
    if(this.events[event]) {
        this.events[event].push(fn);
    } else {
        this.events[event] = [fn];
    }
}

EventEmitter.prototype.emit = function (event) {
    var funs = this.events[event];
    for(var i=0; i<funs.length; i++) {
        funs[i]();
    }
}

module.exports = EventEmitter;