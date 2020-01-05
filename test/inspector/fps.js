var records = [0, 0, 0, 0, 0, 0, 0, 0, 0];
Game.forever(loop);
function loop () {
    var fps = Game.inspector.fps;
    var level = Math.floor(fps/10);
    records[level]++;

    for (var i=0; i<records.length; i++) {
        print(`${i}0-${i}9 fps: ${records[i]}`, 10, 10 + 30*i);
    }
}