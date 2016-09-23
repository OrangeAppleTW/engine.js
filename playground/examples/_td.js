var ctx = Game.ctx;

var clock = 0,
    hp = 100,
    score = 0,
    isBuilding = false;
var enemyPath = [
    {x:96+16, y:64},
    {x:384+32, y:64+16},
    {x:384+16, y:192+32},
    {x:224, y:192+16},
    {x:224+16, y:320+32},
    {x:544+32, y:320+16},
    {x:544+16, y:96}
];

var enemies = Game.sprites.enemies=[];
var towers = Game.sprites.towers=[];
var towerButton = Game.sprites.towerButton = Game.createSprite({
    x:608, y:448,
    costumes:"./images/tower-btn.png"
});
var towerTemplate = Game.sprites.towerTemplate = Game.createSprite({
    x:0, y:0,
    costumes: "./images/tower.png",
    hidden: true
});

Game.on("click", null, function(){
    if(isBuilding){
        if(!towerButton.touched(Game.cursor.x,Game.cursor.y)){
            isBuilding = !isBuilding;
            towerTemplate.hidden = !isBuilding;
            buildTower()
        }
    }
});

towerButton.on("click", function(){
    isBuilding = !isBuilding;
    towerTemplate.hidden = !isBuilding;
});

Game.on("keydown", "s", function(){
    score += 100;
});

Game.update( function(){
    Game.drawBackdrop("./images/map.png")
    Game.drawSprites();
    if(clock%30===0){
        var newEnemy = Game.createSprite({
            x: 112,
            y: 480,
            costumes:"./images/slime.gif"
        });
        newEnemy.pathIndex = 0;
        newEnemy.hp = 10;
        enemies.push(newEnemy);
    }
    for(let i=0; i<enemies.length; i++){
        var enemy = enemies[i]
        if(enemy.hp<=0){
            enemies.splice(i,1);
            score += 10;
        } else {
            var destination = {
                x:enemyPath[enemy.pathIndex].x,
                y:enemyPath[enemy.pathIndex].y
            }
            enemy.toward(destination.x, destination.y);
            enemy.stepForward(3);
            if( enemy.touched(destination.x, destination.y) ){
                enemy.pathIndex++;
                if(enemy.pathIndex>=enemyPath.length){
                    enemies.splice(i,1);
                    hp-=10;
                }
            }
        }
    }
    for(let i=0; i<towers.length; i++){
        if(clock%30<=0){
            towers[i].searchEnemy();
        }
    }
    towerTemplate.moveTo(Game.cursor.x, Game.cursor.y);
    Game.print("HP: "+hp, 20, 40, "white", 20);
    Game.print("Score: "+score, 20, 60, "white", 20);
    Game.print("FPS: "+Game.inspector.fps, 20, 80, "red", 20);
    clock++;
});

function buildTower() {
    var newTower = Game.createSprite({
        x: Game.cursor.x,
        y: Game.cursor.y,
        costumes:"./images/tower.png"
    });
    newTower.range = 96;
    newTower.searchEnemy = function(){
        for(let i=0; i<enemies.length; i++){
            var distance = this.distanceTo(enemies[i]);
            if (distance<=this.range) {
                this.shoot(enemies[i]);
                return;
            }
        }
    };
    newTower.shoot = function(enemy){
        ctx.beginPath();
        ctx.moveTo(this.x,this.y-16);
        ctx.lineTo(enemy.x+16,enemy.y+16);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        enemy.hp -= 10;
    };
    towers.push(newTower);
}

Game.start();