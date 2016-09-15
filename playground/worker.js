(function(){
    var worker = new Worker('../engine.js');
    var proxy = {
        sprites: sprites,
        createSprite: Sprite.new,
        print: renderer.print,
        drawSprites: renderer.drawSprites,
        drawBackdrop: renderer.drawBackdrop,
        cursor: io.cursor,
        inspector: inspector,
        on: eventList.register,
        set: function(){} //@TODO: set ratio
    };
    function Engine(){

        return proxy;
    }
});