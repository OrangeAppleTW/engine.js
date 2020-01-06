function Clock (onTick, render) {

    var running = false;

    // Even the computer executes `stop`, the following instructions will still run. 
    // After that, we'll render the status after complete the tick, instead of the moment when we stop.
    // The reason why is that when the game is stopped, we still need to print the game scores or switch the costume of sprite to the game over,
    // but stop command may be executed in the forever loop or the event callback in onTick function,
    // So if we have to make sure that these things have to be done before the `stop`,
    // it will make designing games more complicated and difficult.
    function gameLoop () {
        if (running) {
            onTick();
            render();
        }
        requestAnimationFrame(gameLoop);
    };

    // when we create the game instance the game loop will start looping,
    // if we stop the game it just makes the game loop skip running game logic and rendering canvas
    gameLoop();

    this.start = function () {
        running = true;
    }

    this.stop = function () {
        running = false;
    }
}

module.exports = Clock;