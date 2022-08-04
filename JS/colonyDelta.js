//Level 2: Colony Delta

const blueNomadMessage = document.getElementById('blueNomadMessage');
blueNomadMessage.style.display = 'none';
const recruitSpace = document.getElementById('recruitSpace');
const recruitBtn = document.getElementById('recruitBtn');
const doNotRecruitBtn = document.getElementById('doNotRecruitBtn');
let bossReleased = false;
let recruited = false;

function recruitBlueNomad() {
    if(team[activeChar].x === 50 && team[activeChar].y === 300 && team.length === 1 && recruited === false) {
        menuOpen = true;
        recruitSpace.style.display = 'none';
        blueNomadMessage.style.display = 'grid';
        recruitBtn.focus();
    }
}

/*
Buildings/Features
-Creates building objects and stores them in an array
*/

let waterPlant = {
    x: 900,
    y: 100,
    width: tileSize * 14,
    height: tileSize * 7
}

buildingsArray.push(waterPlant);
const waterPlantImage = new Image();
waterPlantImage.src = 'Images/Buildings/waterPlant.png';

let verticalBarrier1 = {
    x: 450,
    y: 50,
    width: tileSize,
    height: tileSize * 4
}
buildingsArray.push(verticalBarrier1);
const vertBarImage = new Image();
vertBarImage.src = 'Images/Buildings/verticalBarrier1.png';

let horizontalBarrier1 = {
    x: 525,
    y: 275,
    width: tileSize * 2,
    height: tileSize * 2
}
buildingsArray.push(horizontalBarrier1);
const horBarImage = new Image();
horBarImage.src = 'Images/Buildings/horizontalBarrier1.png';

let horizontalBarrier2 = {
    x: 625,
    y: 350,
    width: tileSize * 3,
    height: tileSize * 1
}
buildingsArray.push(horizontalBarrier2);
const horBar2Image = new Image();
horBar2Image.src = 'Images/Buildings/horizontalBarrier2.png';

let horizontalBarrier3 = {
    x: 625,
    y: 300,
    width: tileSize * 2,
    height: tileSize * 2
}
buildingsArray.push(horizontalBarrier3);
const horBar3Image = new Image();
horBar3Image.src = 'Images/Buildings/horizontalBarrier3.png';

let destroyedFort1 = {
    x: 650,
    y: 0,
    width: tileSize * 5,
    height: tileSize * 6
}
buildingsArray.push(destroyedFort1);
const destFortImage = new Image();
destFortImage.src = 'Images/Buildings/destroyedFort1.png';

let fortcliffLeft = {
    x: 550,
    y: 0,
    width: tileSize * 4,
    height: tileSize * 3
}

buildingsArray.push(fortcliffLeft);
const fortcliffLeftImage = new Image();
fortcliffLeftImage.src = 'Images/Buildings/fortcliffLeft.png';

let fortcliffRight = {
    x: 775,
    y: 0,
    width: tileSize * 4,
    height: tileSize * 3
}

buildingsArray.push(fortcliffRight);
const fortcliffRightImage = new Image();
fortcliffRightImage.src = 'Images/Buildings/fortcliffRight.png';

function drawBuildings() {
    ctx.drawImage(vertBarImage, verticalBarrier1.x, verticalBarrier1.y, verticalBarrier1.width, verticalBarrier1.height);
    ctx.drawImage(horBarImage, horizontalBarrier1.x, horizontalBarrier1.y, horizontalBarrier1.width, horizontalBarrier1.height);
    ctx.drawImage(horBar2Image, horizontalBarrier2.x, horizontalBarrier2.y, horizontalBarrier2.width, horizontalBarrier2.height);
    ctx.drawImage(horBar3Image, horizontalBarrier3.x, horizontalBarrier3.y, horizontalBarrier3.width, horizontalBarrier3.height);
    ctx.drawImage(destFortImage, destroyedFort1.x, destroyedFort1.y, destroyedFort1.width, destroyedFort1.height);
    ctx.drawImage(waterPlantImage, waterPlant.x, waterPlant.y, waterPlant.width, waterPlant.height);
    ctx.drawImage(fortcliffLeftImage, fortcliffLeft.x, fortcliffLeft.y, fortcliffLeft.width, fortcliffLeft.height);
    ctx.drawImage(fortcliffRightImage, fortcliffRight.x, fortcliffRight.y, fortcliffRight.width, fortcliffRight.height);
}

/*Items in the environment
If player moves onto a tile that holds an item, that item is added to their inventory.
*/
function level2BackgroundItems() {
    backgroundItems.push(
    {name: 'Medkit', background: 'Images/Items/medkit.png', description: 'Medkit: Refills health by up to 50 points', x: tileSize * 15, y: tileSize * 12, found: false})
    backgroundItems.push(
    {name: 'Blue Phaser', background: 'Images/Items/bluePhaser.png',  description: 'Blue Phaser: Permanently increases damage by 5', x: tileSize * 8, y: tileSize * 7, found: false})
    backgroundItems.push(
    {name: 'Pills', background: 'Images/Items/pills.png', description: 'Pills: Increases movement stat by 1, but reduces health by 45 points', x: tileSize * 4, y: tileSize * 2, found: false})
};
level2BackgroundItems();

function createEnemies() {
for(let i = 0; i < 1; i++) {
    enemies.push(new redNomad());
    storedEnemies = enemies;
} 
for(let j = 0; j < 1; j++) {
    enemies.push(new greenNomad());
    storedEnemies = enemies;
} 
enemies[0].x = 300;
enemies[0].y = 325;
enemies[1].x = 375;
enemies[1].y = 450;
//enemies[2].x = 200;
//enemies[2].y = 200;
//enemies[3].x = 975;
//enemies[3].y = 550;
//enemies[4].x = 775;
//enemies[4].y = 450;
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

function levelUp() {
    //player = team[activeChar];
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
        if(bossReleased === false) {
            enemies.push(new voidWrecker);
            enemies[0].x = 100;
            enemies[0].y = 100;
        } else {
        team[activeChar].gameLevel = 3;
        team[activeChar].health = team[activeChar].healthStat; 
        team[activeChar].movement = team[activeChar].movementStat;
        localStorage.removeItem('enemyInfo');
        localStorage.setItem('playerInfo', JSON.stringify(atlas));
        if(blueNomad.health > 0) {
        localStorage.setItem('blueNomadInfo', JSON.stringify(blueNomad));
        }
        alert('Thanks for playing, the rest of the game is still in development.');
        location.href = './index.html';
        }
        bossReleased = true;
    }
}

if(localStorage.getItem('blueNomadInfo') === null && recruited === false) {
    recruitBtn.addEventListener('click', function(){ 
        team.push(blueNomad);
        localStorage.setItem('blueNomadInfo', JSON.stringify(blueNomad))
        blueNomadMessage.style.display = 'none';
        alert('You have recruited Blue Nomad to your team! Use the "o" key or the switch Character button in the menu to change between your characters.');
        recruited = true;
        fullMenu.style.display = 'grid';
        menuOpen = true;
        changeCharBtn.focus();
});
} else {
        recruitSpace.style.display = 'none';
        recruited = true;
        blueNomad = JSON.parse(localStorage.getItem('blueNomadInfo'));
        team.push(blueNomad);
}

doNotRecruitBtn.addEventListener('click', function() {
    blueNomadMessage.style.display = 'none';
});

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
    recruitBlueNomad();
    }
    handleEnemies();
    turn();
    requestAnimationFrame(animate);
}

animate();
