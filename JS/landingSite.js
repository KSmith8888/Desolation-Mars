//Level 1: The Landing Site

/*
Buildings/Features
-Creates building objects and stores them in an array
*/

let verticalBarrier1 = {
    x: 300,
    y: 50,
    width: tileSize,
    height: tileSize * 4
}
buildingsArray.push(verticalBarrier1);
const vertBarImage = new Image();
vertBarImage.src = 'Images/Buildings/verticalBarrier1.png';

let horizontalBarrier1 = {
    x: 425,
    y: 275,
    width: tileSize * 2,
    height: tileSize * 2
}
buildingsArray.push(horizontalBarrier1);
const horBarImage = new Image();
horBarImage.src = 'Images/Buildings/horizontalBarrier1.png';

let destroyedFort1 = {
    x: 450,
    y: 0,
    width: tileSize * 5,
    height: tileSize * 6
}
buildingsArray.push(destroyedFort1);
const destFortImage = new Image();
destFortImage.src = 'Images/Buildings/destroyedFort1.png';

function drawBuildings() {
    ctx.drawImage(vertBarImage, verticalBarrier1.x, verticalBarrier1.y, verticalBarrier1.width, verticalBarrier1.height);
    ctx.drawImage(horBarImage, horizontalBarrier1.x, horizontalBarrier1.y, horizontalBarrier1.width, horizontalBarrier1.height);
    ctx.drawImage(destFortImage, destroyedFort1.x, destroyedFort1.y, destroyedFort1.width, destroyedFort1.height);
}

/*Items in the environment
If player moves onto a tile that holds an item, that item is added to their inventory.
*/
function level1BackgroundItems() {
    backgroundItems.push(
    {name: 'Medkit', background: 'Images/Items/medkit.png', description: 'Medkit: Refills health by up to 50 points', x: tileSize * 7, y: tileSize * 12, found: false});
    backgroundItems.push(
    {name: 'Blue Phaser', background: 'Images/Items/bluePhaser.png',  description: 'Blue Phaser: Permanently increases damage by 5', x: tileSize * 4, y: tileSize * 5, found: false});
};
level1BackgroundItems();

function createEnemies() {
for(let i = 0; i < 3; i++) {
    enemies.push(new greenNomad());
    
} 
enemies[0].x = 800;
enemies[0].y = 325;
enemies[1].x = 375;
enemies[1].y = 450;
enemies[2].x = 200;
enemies[2].y = 200;
enemies.push(new redNomad());
enemies[3].x = 975;
enemies[3].y = 550;
storedEnemies = enemies;
}

//If save data is present, sets enemies array to match saved enemy positions and health, otherwise creates new level start enemies.
function checkForSavedEnemies() {
if(localStorage.getItem('enemyInfo') != null) { 
    storedEnemies = JSON.parse(localStorage.getItem('enemyInfo'))
    for(let i = 0; i < storedEnemies.length; i++) {
        if(storedEnemies[i].enemyType === 'Green Nomad') {
        enemies.push(new greenNomad());
        enemies[i].health = storedEnemies[i].health;
        enemies[i].x = storedEnemies[i].x;
        enemies[i].y = storedEnemies[i].y;
        } else if(storedEnemies[i].enemyType === 'Red Nomad') {
        enemies.push(new redNomad());
        enemies[i].health = storedEnemies[i].health;
        enemies[i].x = storedEnemies[i].x;
        enemies[i].y = storedEnemies[i].y;    
        }
    }
} else {
    createEnemies();
}
}
checkForSavedEnemies();

//Solid Environmental Collision Detection
function solidColDetect(player) {
    player = team[activeChar];
    solidCollideRight = false;
    solidCollideLeft = false;
    solidCollideUp = false;
    solidCollideDown = false;
    for(let i = 0; i < buildingsArray.length; i++) {
        if( 
        player.x + player.width === buildingsArray[i].x &&
        player.y < buildingsArray[i].y + buildingsArray[i].height &&
        player.y + player.height > buildingsArray[i].y) {
            solidCollideRight = true;
        }
        if(
        player.x === buildingsArray[i].x + buildingsArray[i].width &&
        player.y < buildingsArray[i].y + buildingsArray[i].height &&
        player.y + player.height > buildingsArray[i].y) {
            solidCollideLeft = true;
        } 
        if(
        player.y === buildingsArray[i].y + buildingsArray[i].height &&
        player.x >= buildingsArray[i].x &&
        player.x < buildingsArray[i].x + buildingsArray[i].width) {
            solidCollideUp = true;
        } 
        if(
        player.y + player.height === buildingsArray[i].y &&
        player.x >= buildingsArray[i].x &&
        player.x < buildingsArray[i].x + buildingsArray[i].width
        ) {
            solidCollideDown = true;
        }
}
}

/*
Checks the array of buildings to see which tiles are underneath a building or other solid feature. Sets a property of that tile that prevents user from clicking on it to move the player there.
*/
function isTileUnderBuilding() {
    for(let i = 0; i < tiles.length; i++) {
        for(let j = 0; j < buildingsArray.length; j++) {
            if(
                tiles[i].x < buildingsArray[j].x + buildingsArray[j].width && 
                tiles[i].x + tiles[i].width > buildingsArray[j].x &&
                tiles[i].y < buildingsArray[j].y + buildingsArray[j].height &&
                tiles[i].y + tiles[i].height > buildingsArray[j].y
            ) {
                tiles[i].solid = true;
                minimapTiles[i].solid = true;
            }  
        }
    }
}
isTileUnderBuilding();

//Leveling Up
function levelUp() {
    let random = Math.floor(Math.random() * 3);
    let stats = ['Health', 'Damage', 'Movement'];
    if(team[activeChar].exp === 100) {
        if(stats[random] === 'Health') {
            team[activeChar].healthStat += 10;
        } else if(stats[random] === 'Damage') {
            team[activeChar].damage += 5;
        } else if(stats[random] === 'Movement') {
            team[activeChar].movementStat += 1;
        }
    team[activeChar].exp = 0;
    team[activeChar].playerLevel += 1;
    }
    if(enemies.length === 0) {
        team[activeChar].gameLevel = 2;
        team[activeChar].x = 50;
        team[activeChar].y = 50;
        team[activeChar].health = team[activeChar].healthStat; 
        team[activeChar].movement = team[activeChar].movementStat;
        buildingsArray = [];
        backgroundItems = [];
        localStorage.removeItem('enemyInfo');
        localStorage.setItem('playerInfo', JSON.stringify(atlas));
        alert('Level 2: Colony Delta');
        location.href = './colonyDelta.html';
    }
}

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuildings();
    drawHealthBar();
    drawPlayer();
    if(displayMinimap) {
        drawMinimap();
    }
    if(team.includes(blueNomad)) {
        drawBlueNomad();
    }
    if(battle){
        drawEnemyHealthBar(whichEnemyAttacking);
        damageText();
    }else {
    enemyColDetect();
    solidColDetect();
    enemySolidColDetect();
    enemyEnemyColDetect();
    }
    handleEnemies();
    turn();
    requestAnimationFrame(animate);
}

animate();
