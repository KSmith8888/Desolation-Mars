const canvas = document.getElementById('landingSiteCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let moving = false;
let tileSize = 25;
let buildingsArray = [];

let enemies = [];
let storedEnemies = [];

let battle = false;
let whichEnemyAttacking = 0;

let solidCollideRight = false;
let solidCollideLeft = false;
let solidCollideUp = false;
let solidCollideDown = false;

let verticalLines = [];
let horizontalLines = [];
let tiles = [];

let menuOpen = false;
let playerHit = false;
let enemyHit = false;

const grid = document.getElementById('grid');
grid.style.display = 'none';
const playerImage = new Image();
playerImage.src = 'Images/playerV4.png';

const menuAltBtn = document.getElementById('menuAltBtn');
const itemsMenu = document.getElementById('itemsMenu');
itemsMenu.style.display = 'none';
const itemsCloseBtn = document.getElementById('itemsCloseBtn');
const item1 = document.getElementById('item1');
const item2 = document.getElementById('item2');
const item3 = document.getElementById('item3');
const item4 = document.getElementById('item4');
const item5 = document.getElementById('item5');
const item6 = document.getElementById('item6');
const item7 = document.getElementById('item7');
const item8 = document.getElementById('item8');
const item9 = document.getElementById('item9');

const fullMenu = document.getElementById('fullMenu');
fullMenu.style.display = 'none';
const itemsMenuBtn = document.getElementById('itemsMenuBtn');
const mapInfoBtn = document.getElementById('mapInfoBtn');
const mapDetails = document.getElementById('mapDetails');
mapDetails.style.display = 'none';
//const mapDetailsCloseBtn = document.getElementById('mapDetailsCloseBtn');
const objectiveBtn = document.getElementById('objectiveBtn');
const objStatDetails = document.getElementById('objStatDetails');
objStatDetails.style.display = 'none';
const mapDetailsDescription = document.getElementById('mapDetailsDescription');
const objStatDescription = document.getElementById('objStatDescription');
//const objStatCloseBtn = document.getElementById('objStatCloseBtn');
//objStatCloseBtn.style.display = 'none';
const showGridBtn = document.getElementById('showGridBtn');
const hideGridBtn = document.getElementById('hideGridBtn');
const endTurnBtn = document.getElementById('endTurnBtn');
const saveGameBtn = document.getElementById('saveGameBtn');
const loadFileBtn = document.getElementById('loadFileBtn');
const deleteDataBtn = document.getElementById('deleteDataBtn');
const exitGameBtn = document.getElementById('exitGameBtn');   
const closeMenuBtn = document.getElementById('closeMenuBtn');

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

/*
-Creates dynamic JS grid to control movement
Draws a line on the canvas for every 30px(the tile size) vertically and horizontally and stores them in arrays. Uses those lines to create tile onjects where the lines intersect and pushes those tiles into another array.
-Visible grid is separate and CSS only but overlaps the same lines. That grid only becomes visible during players turn.
*/

function createGrid() {
    for(let i = 0; i < canvas.width; i += tileSize) {
    verticalLines.push(i);
    }
    for(let k = 0; k < canvas.height; k += tileSize) {
    horizontalLines.push(k);
    }
}
createGrid();

function createTiles() {
    let k = 0;
    for(let i = 0; i < horizontalLines.length; i++) {
        for(let j = 0; j < verticalLines.length; j++) {
            k += 1;
            tiles.push(
                {name: 'tile' + (k), 
                x: verticalLines[j], 
                y: horizontalLines[i],
                row: (i + 1), column: (j + 1),
                width: 25, height: 25,
                solid: false});
        }
    }
}
createTiles();

//Player
const player = JSON.parse(localStorage.getItem('playerInfo')) || {
    health: 100,
    x: 50,
    y: 50,
    posX: 60,
    posY: 60,
    width: 25,
    height: 25,
    damage: 20,
    exp: 0,
    healthStat: 100,
    movementStat: 5,
    playerLevel: 1,
    gameLevel: 1,
    movement: 5,
    items: []
}

function drawPlayer() {
    if(player.x > verticalLines[verticalLines.length - 2]) {
        player.x = verticalLines[verticalLines.length - 2];
    } else if(player.x < 0) {
        player.x = 0;
    } else if(player.y < 0) {
        player.y = 0;
    } else if(player.y > horizontalLines[horizontalLines.length - 2]) {
        player.y = horizontalLines[horizontalLines.length - 2];
    }
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

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
vertBarImage.src = 'Images/verticalBarrier1.png';

let horizontalBarrier1 = {
    x: 425,
    y: 275,
    width: tileSize * 2,
    height: tileSize * 2
}
buildingsArray.push(horizontalBarrier1);
const horBarImage = new Image();
horBarImage.src = 'Images/horizontalBarrier1.png';

let destroyedFort1 = {
    x: 450,
    y: 0,
    width: tileSize * 5,
    height: tileSize * 6
}
buildingsArray.push(destroyedFort1);
const destFortImage = new Image();
destFortImage.src = 'Images/destroyedFort1.png';

function drawBuildings() {
    ctx.drawImage(vertBarImage, verticalBarrier1.x, verticalBarrier1.y, verticalBarrier1.width, verticalBarrier1.height);
    ctx.drawImage(horBarImage, horizontalBarrier1.x, horizontalBarrier1.y, horizontalBarrier1.width, horizontalBarrier1.height);
    ctx.drawImage(destFortImage, destroyedFort1.x, destroyedFort1.y, destroyedFort1.width, destroyedFort1.height);
}

/*Items Menu
Loops through the players item property array and adds a background image and description of the item to the item select buttons in the item menu. The description of each item is visible on hover or focus. 
*/
function openedItemsMenu() {
    itemsMenu.style.display = 'grid';
    item1.focus();
    for(let i = 0; i < player.items.length; i++) {
        document.getElementById('item' + (i + 1)).style.backgroundImage = `url('${player.items[i].background}')`;
        document.getElementById('item' + (i + 1) + 'Text').innerText = player.items[i].description;
    }
    document.getElementById('item' + (player.items.length + 1)).style.backgroundImage = '';
    document.getElementById('item' + (player.items.length + 1) + 'Text').innerText = '';
}

itemsCloseBtn.addEventListener('click', function() {
    itemsMenu.style.display = 'none';
    closeMenuBtn.focus();
});

//Health bar container object and draw function
//fillRect is based on players health property and changes when players health is updated
const healthBarCon = {
    x: 40,
    y: 10,
    width: player.healthStat * 2,
    height: 15
}

function drawHealthBar() {
    ctx.strokeStyle = 'gold';
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(healthBarCon.x, healthBarCon.y);
    ctx.lineTo(healthBarCon.x + healthBarCon.width, healthBarCon.y);
    ctx.lineTo(healthBarCon.x + healthBarCon.width, healthBarCon.y + healthBarCon.height);
    ctx.lineTo(healthBarCon.x, healthBarCon.y + healthBarCon.height);
    ctx.lineTo(healthBarCon.x, healthBarCon.y);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.fillRect(healthBarCon.x + 2, healthBarCon.y + 2, player.health * 2 - 4, healthBarCon.height - 4);
}

/*Items in the environment
If player moves onto a tile that holds an item, that item is added to their inventory.
*/
let backgroundItems = [
    {name: 'Medkit', background: 'Images/medkit.png', description: 'Medkit: Refills health by 50 points', x: tileSize * 7, y: tileSize * 12, found: false},
    {name: 'Blue Phaser', background: 'Images/bluePhaser.png',  description: 'Blue Phaser: Permanently increases damage by 5', x: tileSize * 4, y: tileSize * 5, found: false}
];

function pickedUpItem() {
    for(let i = 0; i < player.items.length; i++) {
        if(player.items[i].found === true) {
            delete player.items[i].x;
            delete player.items[i].y;
            delete player.items[i].found;
        }
    }
}

/*
When an item is used, adjusts players stats based on the name of the item and removes it from the players items property. 
*/
function useItem(index) {
    if(player.items[index].name === 'Medkit') {
        player.health += 50;
    } else if(player.items[index].name === 'Blue Phaser') {
        player.damage += 5;
    }
    player.items.splice(index, 1);
    openedItemsMenu();
}

item1.addEventListener('click', function() {
    if(player.items[0] !== undefined) {
    useItem(0);
    }
});
item2.addEventListener('click', function() {
    if(player.items[1] !== undefined) {
    useItem(1);
    }
});
item3.addEventListener('click', function() {
    if(player.items[2] !== undefined) {
    useItem(2);
    }
});
item4.addEventListener('click', function() {
    if(player.items[3] !== undefined) {
    useItem(3);
    }
});
item5.addEventListener('click', function() {
    if(player.items[4] !== undefined) {
    useItem(4);
    }
});
item6.addEventListener('click', function() {
    if(player.items[5] !== undefined) {
    useItem(5);
    }
});
item7.addEventListener('click', function() {
    if(player.items[6] !== undefined) {
    useItem(6);
    }
});
item8.addEventListener('click', function() {
    if(player.items[7] !== undefined) {
    useItem(7);
    }
});
item9.addEventListener('click', function() {
    if(player.items[8] !== undefined) {
    useItem(8);
    }
});

/*Click Events
When user clicks on a tile, conditional statement checks:
-That the click was not in the top left of the screen where the menu is located
-That the menu is not currently open and that the players movement property is positive

Then a loop iterates through the array of tile objects with collision detection to determine which tile was clicked. 
-It then compares the players current position to the clicked tile to determine if the player has a large enough movement property to get them to the clicked tile. 
-If so, players coordinates are updated to the clicked tile and the movement property is updated.
-Checks if the space the player landed on has an item on it.
*/
document.addEventListener('click', function(e) {
    if(e.clientX < 50 && e.clientY < 50) {
        console.log('Invalid Movement Area Clicked - Menu');
    } else if(!menuOpen && player.movement > 0 && !battle) { 
    for(let i = 0; i < tiles.length; i++) {
        if( 
            e.clientX >= tiles[i].x
            && e.clientX < tiles[i].x + tiles[i].width
            && e.clientY >= tiles[i].y
            && e.clientY < tiles[i].y + tiles[i].height
            && tiles[i].solid === false) {
                if(player.x < tiles[i].x && player.movement - ((tiles[i].x - player.x) / 25) >= 0) {
                    if(player.y < tiles[i].y && player.movement - ((tiles[i].y - player.y) / 25) - ((tiles[i].x - player.x) / 25) >= 0) {
                        player.movement -= (((tiles[i].y - player.y) / 25) + ((tiles[i].x - player.x) / 25));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(player.y > tiles[i].y && player.movement - ((player.y - tiles[i].y) / 25) - ((tiles[i].x - player.x) / 25) >= 0){
                        player.movement -= (((player.y - tiles[i].y) / 25) + ((tiles[i].x - player.x) / 30));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(tiles[i].y === player.y) {
                        player.movement -= ((tiles[i].x - player.x) / 25);
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    }
                } else if(player.x > tiles[i].x && player.movement - ((player.x - tiles[i].x) / 25) >= 0){
                    if(player.y < tiles[i].y && player.movement - ((tiles[i].y - player.y) / 25) - ((player.x - tiles[i].x) / 25) >= 0) {
                        player.movement -= (((tiles[i].y - player.y) / 25) - ((tiles[i].x - player.x) / 25));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(player.y > tiles[i].y && player.movement - ((player.y - tiles[i].y) / 25) - ((player.x - tiles[i].x) / 25) >= 0){
                        player.movement -= (((player.y - tiles[i].y) / 25) - ((tiles[i].x - player.x) / 25));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(tiles[i].y === player.y) {
                        player.movement -= ((player.x - tiles[i].x) / 25);
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    }
                } else if(player.x === tiles[i].x) {
                    if(player.y < tiles[i].y && player.movement - ((tiles[i].y - player.y) / 25) - ((player.x - tiles[i].x) / 25) >= 0) {
                        player.movement -= (((tiles[i].y - player.y) / 25) + ((tiles[i].x - player.x) / 25));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(player.y > tiles[i].y && player.movement - ((player.y - tiles[i].y) / 25) - ((player.x - tiles[i].x) / 25) >= 0){
                        player.movement -= (((player.y - tiles[i].y) / 25) + ((tiles[i].x - player.x) / 25));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    }
                } 
        }
    } 
}
for(let i = 0; i < backgroundItems.length; i++) {
    if(backgroundItems[i].x === player.x && backgroundItems[i].y === player.y && backgroundItems[i].found === false) {
        backgroundItems[i].found = true;
        player.items.push(backgroundItems[i]);
        alert(`you picked up ${backgroundItems[i].name}`);
        pickedUpItem();
    }
}
});

//Key Events
/*
Keyboard controls use either wasd or arrow keys to move and p to open the menu. When moving, conditionals check that the player is not attempting to move into a space occupied by a building, that a battle sequence is not currently occuring and that the menu is not open.
*/
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
        rightPressed = true;
        if(!solidCollideRight && player.movement > 0 && !battle && !menuOpen) {
        player.x += tileSize;
        player.movement -= 1;
    }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
        leftPressed = true;
        if(!solidCollideLeft && player.movement > 0 && !battle && !menuOpen) {
        player.x -= tileSize;
        player.movement -= 1;
    }
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') {
        upPressed = true;
        if(!solidCollideUp && player.movement > 0 && !battle && !menuOpen) {
        player.y -= tileSize;
        player.movement -= 1;
    }
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') {
        downPressed = true;
        if(!solidCollideDown && player.movement > 0 && !battle && !menuOpen) {
        player.y += tileSize;
        player.movement -= 1;
    }
    } else if(e.key == 'p' && !battle) {
        fullMenu.style.display = 'grid';
        menuOpen = true;
        itemsMenuBtn.focus();
    }
    for(let i = 0; i < backgroundItems.length; i++) {
        if(backgroundItems[i].x === player.x && backgroundItems[i].y === player.y && backgroundItems[i].found === false) {
            backgroundItems[i].found = true;
            player.items.push(backgroundItems[i]);
            alert(`you picked up ${backgroundItems[i].name}`);
            pickedUpItem();
        }
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight" || e.key == 'd') {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft" || e.key == 'a') {
        leftPressed = false;
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp' || e.key == 'w') {
        upPressed = false;
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown' || e.key == 's') {
        downPressed = false;
    } 
}

/*
Turns 
-When players movement property is above 0, makes grid visible
-Once movement reaches 0, if a battle sequence is not in progress, hides grid and allows enemies to move. Then resets players movement property
*/

function turn() {
    if(player.movement > 0) {
       //players turn
    } else {
        if(!battle) {
        enemyMovement();
        player.movement = player.movementStat;
        }
    }
}

//Enemies
class greenNomad {
    constructor() {
        this.enemyType = 'Green Nomad';
        this.health = 50;
        this.maxHealth = 50;
        this.defeated = false;
        this.width = 25; 
        this.height = 25;
        this.damage = 10;
        this.image = new Image();
        this.image.src = 'Images/greenMageV3.png';
    } draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

class redNomad {
    constructor() {
        this.enemyType = 'Red Nomad';
        this.health = 70;
        this.maxHealth = 70;
        this.defeated = false;
        this.width = 25; 
        this.height = 25;
        this.damage = 15;
        this.image = new Image();
        this.image.src = 'Images/redNomad.png';
    } draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

function createEnemies() {
for(let i = 0; i < 3; i++) {
    enemies.push(new greenNomad());
    storedEnemies = enemies;
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
}

//If save data is present, sets enemies array to match saved enemy positions and health, otherwise creates new level start enemies.
function checkForSavedEnemies() {
if(localStorage.getItem('enemyInfo') != null) { 
    storedEnemies = JSON.parse(localStorage.getItem('enemyInfo'))
    for(let i = 0; i < storedEnemies.length; i++) {
        if(storedEnemies.enemyType === 'Green Nomad') {
        enemies.push(new greenNomad());
        enemies[i].health = storedEnemies[i].health;
        enemies[i].x = storedEnemies[i].x;
        enemies[i].y = storedEnemies[i].y;
        } else if(storedEnemies.enemyType === 'Red Nomad') {
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

//Enemy Healthbar
function drawEnemyHealthBar(enemyIndex) {
    if(enemies[enemyIndex].health > 0) {
    ctx.strokeStyle = 'gold';
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(enemies[enemyIndex].x - 15, enemies[enemyIndex].y - 13);
    ctx.lineTo(enemies[enemyIndex].x + enemies[enemyIndex].maxHealth, enemies[enemyIndex].y - 13);
    ctx.lineTo(enemies[enemyIndex].x + enemies[enemyIndex].maxHealth, enemies[enemyIndex].y - 5);
    ctx.lineTo(enemies[enemyIndex].x - 15, enemies[enemyIndex].y - 5);
    ctx.lineTo(enemies[enemyIndex].x - 15, enemies[enemyIndex].y - 13);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'red';
    ctx.fillRect(enemies[enemyIndex].x - 13, enemies[enemyIndex].y - 11, enemies[enemyIndex].health, 6);
    }
}

//Leveling Up
function levelUp() {
    let random = Math.floor(Math.random() * 3);
    let stats = ['Health', 'Damage', 'Movement'];
    if(player.exp === 100) {
        if(stats[random] === 'Health') {
            player.healthStat += 10;
        } else if(stats[random] === 'Damage') {
            player.damage += 5;
        } else if(stats[random] === 'Movement') {
            player.movementStat += 1;
        }
    player.exp = 0;
    player.playerLevel += 1;
    }
    if(enemies.length === 0) {
        player.gameLevel = 2;
        alert('Level 2: Colony Delta');
        location.href = './colonyDelta.html';
    }
}

/*Battle Mechanics
When collision detection is set off between the player and an enemy, the battle property of that enemy is set to true. The enemyAttack and playerAttack functions go back and forth as long as both the enemy and player have health properties above 0. While the battle is active, the player cannot move or open the menu and collision detection is off.
*/

function playerAttack(enemyIndex) {
    enemies[enemyIndex].x -= 15;
    playerHit = false;
if(enemies[enemyIndex].health > 0 && player.health > 0) {
    enemyHit = true;
    enemies[enemyIndex].health -= player.damage;
    setTimeout(function() {
    enemies[enemyIndex].x += 15;
    enemyAttack(enemyIndex);
    }, 1250);
} else {
    battle = false;
    enemies[enemyIndex].x += 15;
    alert('Game over');
    location.reload();
}
}

function enemyAttack(enemyIndex) {
    player.x += 15;
    enemyHit = false;
    battle = true;
if(player.health > 0 && enemies[enemyIndex].health > 0) {
    playerHit = true;
    player.health -= enemies[enemyIndex].damage;
    setTimeout(function() {
    player.x -= 15;
    playerAttack(enemyIndex);
    }, 1250);
} else {
    battle = false;
    player.x -= 15;
    player.exp += 50;
    enemies.splice(whichEnemyAttacking, 1);
    levelUp();
}
}

function damageText() {
    ctx.fillStyle = 'black';
    if(playerHit && player.health > 0) {
        ctx.font = '22px georgia';
        ctx.fillText(`-${enemies[whichEnemyAttacking].damage}`, healthBarCon.x, healthBarCon.y + 40);
    } else if(enemyHit && enemies[whichEnemyAttacking].health > 0) {
        ctx.font = '22px georgia';
        ctx.fillText(`-${player.damage}`, enemies[whichEnemyAttacking].x, enemies[whichEnemyAttacking].y - 20);
    }
}

function handleEnemies() {
    for(let i = 0; i < enemies.length; i++) {
        if(enemies[i].x > verticalLines[verticalLines.length - 2]) {
            enemies[i].x = verticalLines[verticalLines.length - 2];
        } else if(enemies[i].x < 0) {
            enemies[i].x = 0;
        } else if(enemies[i].y < 0) {
            enemies[i].y = 0;
        } else if(enemies[i].y > horizontalLines[horizontalLines.length - 2]) {
            enemies[i].y = horizontalLines[horizontalLines.length - 2];
        }
        if(enemies[i].health > 0) {
        enemies[i].draw();
        } else {
        enemies[i].defeated = true;
        }
        //storedEnemies = enemies;
    }
}

function enemyMovement() {
    for(let i = 0; i < enemies.length; i++) {
        if(player.x > enemies[i].x) {
            enemies[i].x += (Math.floor(Math.random() * 3) + 1) * tileSize;
        } else {
            enemies[i].x -= (Math.floor(Math.random() * 3) + 1) * tileSize;
        }
        if(player.y > enemies[i].y) {
            enemies[i].y += (Math.floor(Math.random() * 3) + 1) * tileSize;
        } else {
            enemies[i].y -= (Math.floor(Math.random() * 3) + 1) * tileSize;
        }
}
}

/*Enemy Collision Detection
When collision is detected, initiates battle sequence between that enemy and the player. Sets whichEnemyAttacking variable to the index of the enemy that collided so that animation loop calls the enemy health bar and damage text to show above the attacking enemy. 
*/
function enemyColDetect() {
    for(let i = 0; i < enemies.length; i++) {
    if(
        player.x < enemies[i].x + enemies[i].width && 
    player.x + player.width > enemies[i].x &&
    player.y < enemies[i].y + enemies[i].height &&
    player.y + player.height > enemies[i].y
    ){
        if(player.health > 0 && enemies[i].defeated === false) { 
        whichEnemyAttacking = i;
        enemyAttack(i);  
        }
        }
    }
}

//Solid Environmental Collision Detection
function solidColDetect() {
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
            }  
        }
    }
}
isTileUnderBuilding();

/*Menu-
Listens for p key being pressed, based on selection-
--Items opens the items menu
--Map Details shows the current enemies on the board
--Objective/Stats shows the mission objective and the players current stats
--Save game saves player object and enemy array info to localStorage
--Delete save data removes items from localStorage
--Load file reloads current page
--Exit game changes location to title screen
*/
menuAltBtn.addEventListener('click', function() {
    if(!battle) {
    fullMenu.style.display = 'grid';
    menuOpen = true;
    }
});
            
itemsMenuBtn.addEventListener('click', function() {
    openedItemsMenu();
});

endTurnBtn.addEventListener('click', function() {
    player.movement = 0;
});

mapDetailsCloseBtn.addEventListener('click', function() {
    mapDetails.style.display = 'none';
    mapDetailsCloseBtn.style.display = 'none';
    mapDetailsDescription.innerText = '';
    closeMenuBtn.focus();
});

mapInfoBtn.addEventListener('click', function() {
    let currentEnemies = [];
    for(let i = 0; i < enemies.length; i++) {
        currentEnemies.push(enemies[i].enemyType);
        currentEnemies.push(enemies[i].health);
        currentEnemies.push(enemies[i].damage);
    }
    mapDetails.style.display = 'grid';
    mapDetailsCloseBtn.style.display = 'grid';
    mapDetailsDescription.innerText = `Enemies remaining: 
    ${JSON.stringify(currentEnemies)}`;
    showGridBtn.focus();
});

showGridBtn.addEventListener('click', function() {
    grid.style.display = 'grid';
});

hideGridBtn.addEventListener('click', function() {
    grid.style.display = 'none';
});

objStatCloseBtn.addEventListener('click', function() {
    objStatDetails.style.display = 'none';
    objStatCloseBtn.style.display = 'none';
    objStatDescription.innerText = '';
});

objectiveBtn.addEventListener('click', function() {
    objStatDetails.style.display = 'grid';
    objStatCloseBtn.style.display = 'grid';
    objStatDescription.innerText = `Objective: Defeat all enemies on the board 
    Stats- 
    Level: ${JSON.stringify(player.playerLevel)}
    Max Health: ${JSON.stringify(player.healthStat)}
    Damage: ${JSON.stringify(player.damage)}
    Movement: ${JSON.stringify(player.movementStat)}
    Exp: ${JSON.stringify(player.exp)}
    Current Health: ${JSON.stringify(player.health)}
    `;
    objStatCloseBtn.focus();
});

saveGameBtn.addEventListener('click', function() {
    localStorage.setItem('playerInfo', JSON.stringify(player));
    localStorage.setItem('enemyInfo', JSON.stringify(enemies));
    //localStorage.setItem('enemyInfo', JSON.stringify(storedEnemies));
});

loadFileBtn.addEventListener('click', function() {
    location.reload();
});

deleteDataBtn.addEventListener('click', function() {
    localStorage.clear();
});

exitGameBtn.addEventListener('click', function() {
    location.href = './index.html';
});

closeMenuBtn.addEventListener('click', function() {
    fullMenu.style.display = 'none';
    menuOpen = false;
});

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBuildings();
    drawHealthBar();
    drawPlayer();
    if(battle){
        drawEnemyHealthBar(whichEnemyAttacking);
        damageText();
    }else {
    enemyColDetect();
    solidColDetect();
    }
    handleEnemies();
    turn();
    requestAnimationFrame(animate);
}

animate();
