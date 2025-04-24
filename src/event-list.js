const VALID_EVENT_NAMES = ['click', 'mousedown', 'mouseup', 'keydown', 'keyup', 'holding', 'touch', 'hover'];

function EventList(io){
    this.pool = [];
    this.io = io;
}

EventList.prototype = {

    traverse: function (){

        var io = this.io;
        var self = this;
        this.pool.forEach(function (e) {
            if      (e.event === 'touch')     self.touchJudger( e.sprite, e.handler, e.targets);
            else if (e.event === 'click')     self.mouseJudger( e.sprite, e.handler, io.clicked);
            else if (e.event === 'hover')     self.hoverJudger( e.sprite, e.handler, io.cursor);
            else if (e.event === 'mousedown') self.mouseJudger( e.sprite, e.handler, io.mousedown);
            else if (e.event === 'mouseup')   self.mouseJudger( e.sprite, e.handler, io.mouseup);
            else if (e.event === 'holding')   self.keyJudger(   e.key,    e.handler, io.holding);
            else if (e.event === 'keyup')     self.keyJudger(   e.key,    e.handler, io.keyup);
            else if (e.event === 'keydown')   self.keyJudger(   e.key,    e.handler, io.keydown);
        });

        this.pool = this.pool.filter(function (e) {
            return !(e.sprite && e.sprite._deleted);
        });

        io.clearEvents();
    },

    register: function () {

        if (!this.validEventName(arguments[0])) return;

        var event = arguments[0];
        var eventObj = {
            event: event,
            handler: arguments[arguments.length - 1]
        }        

        if (event === 'touch'){
            eventObj.sprite = arguments[1];
            eventObj.targets = arguments[2] instanceof Array ? arguments[2] : [arguments[2]];
        }
        else if (event === 'hover') {
            eventObj.sprite = arguments[1] instanceof Array ? arguments[1] : [arguments[1]];
        }
        else if (['keydown', 'keyup', 'holding'].includes(event)){
            eventObj.key = arguments[1] instanceof Function ? 'any' : arguments[1];
        }
        else if (['mousedown', 'mouseup', 'click'].includes(event)) {
            if (arguments[1] instanceof Function) {
                eventObj.sprite = null;
            } else {
                eventObj.sprite = arguments[1] instanceof Array ? arguments[1] : [arguments[1]];
            }
        }
        else if (event === 'listen') {
            eventObj.message = arguments[1];
            eventObj.sprite = arguments[2];
        }

        this.pool.push(eventObj);
    },

    emit: function (eventName) {
        for(let i=0; i<this.pool.length; i++) {
            var e = this.pool[i];
            if(e.event == 'listen' && e.message == eventName) {
                e.handler.call(e.sprite);
            }
        }
    },

    mouseJudger: function (sprite, handler, mouse) {
        if (!mouse.x || !mouse.y) return; // 如果有點擊記錄才檢查
        if (sprite) {
            sprite.forEach(function (s) {
                if (s.touched(mouse.x, mouse.y)) {
                    handler.call(s);
                }
            });
        } else {
            handler();
        }
    },

    keyJudger: function(target, handler, keys) {
        if (keys[target]) handler();
    },

    touchJudger: function (sprite, handler, targets) {
        targets.forEach(function (t) {
            if (sprite.touched(t)) handler.call(sprite, t);
        });
    },

    hoverJudger: function (sprite, handler, cursor){
        sprite.forEach(function (s) {
            if (s.touched(cursor.x, cursor.y)) handler.call(s);
        });
    },

    validEventName: function (eventName) {
        if (VALID_EVENT_NAMES.includes(eventName) === false) {
            console.error('`' + eventName + '` 事件是不支援的，請檢查是否符合以下支援的事件\n ' +
            this.VALID_EVENT_NAMES.join(', '));
        }
        return true;
    },

    VALID_EVENT_NAMES: VALID_EVENT_NAMES,
}

module.exports = EventList;