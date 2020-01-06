
Game.set({ autoRendering: false });

Game.forever(function(){
    pen.drawCircle(cursor.x, cursor.y, 10);
});

