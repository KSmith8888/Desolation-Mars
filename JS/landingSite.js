const canvas = document.getElementById('landingSiteCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

let moving = false;
let tileSize = 30;
let buildingsArray = [];

let enemies = [];
let storedEnemies = [];

let solidCollideRight = false;
let solidCollideLeft = false;
let solidCollideUp = false;
let solidCollideDown = false;

let verticalLines = [];
let horizontalLines = [];

let menuOpen = false;

//Set movement to row and column properties on player/enemies

const grid = document.getElementById('grid');
const fsBackgroundEmpty = document.getElementById('fsBackgroundEmpty');
const playerImage = document.getElementById('playerImage');

const menu = document.getElementById('menu');
const blankOption = document.getElementById('blankOption');

const itemsMenu = document.getElementById('itemsMenu');
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

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//Creates dynamic JS grid to control movement
//Visible grid is CSS only and becomes visible during players turn

function createGrid() {
    for(let i = 0; i < canvas.width; i += tileSize) {
    verticalLines.push(i);
    }
    for(let k = 0; k < canvas.height; k += tileSize) {
    horizontalLines.push(k);
    }
}
createGrid();

let tiles = [];

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
                width: 30, height: 30,
                solid: false});
        }
    }
}
createTiles();

/*
Background
Buildings
-Creates building objects and storesthem in an array
-Collision detection to prevent player from moving into buildings
*/

const verticalBarrier1 = {
    x: verticalLines[9],
    y: horizontalLines[2],
    width: tileSize,
    height: tileSize * 4
}
buildingsArray.push(verticalBarrier1);
const vertBarImage = new Image();
vertBarImage.src = 'Images/verticalBarrier1.png';

const horizontalBarrier1 = {
    x: verticalLines[14],
    y: horizontalLines[10],
    width: tileSize * 2,
    height: tileSize * 2
}
buildingsArray.push(horizontalBarrier1);
const horBarImage = new Image();
horBarImage.src = 'Images/horizontalBarrier1.png';

const destroyedFort1 = {
    x: verticalLines[15],
    y: 0,
    width: tileSize * 5,
    height: tileSize * 6
}
buildingsArray.push(destroyedFort1);
const destFortImage = new Image();
destFortImage.src = 'Images/destroyedFort1.png';

function drawBackground() {
    ctx.drawImage(fsBackgroundEmpty, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(vertBarImage, verticalBarrier1.x, verticalBarrier1.y, verticalBarrier1.width, verticalBarrier1.height);
    ctx.drawImage(horBarImage, horizontalBarrier1.x, horizontalBarrier1.y, horizontalBarrier1.width, horizontalBarrier1.height);
    ctx.drawImage(destFortImage, destroyedFort1.x, destroyedFort1.y, destroyedFort1.width, destroyedFort1.height);
}

//Items Menu
itemsMenu.style.display = 'none';

function openedItemsMenu() {
    itemsMenu.style.display = 'grid';
    for(let i = 0; i < player.items.length; i++) {
        document.getElementById('item' + (i + 1)).style.backgroundImage = `url('${player.items[i].background}')`;
        document.getElementById('item' + (i + 1) + 'Text').innerText = player.items[i].description;
    }
    document.getElementById('item' + (player.items.length + 1)).style.backgroundImage = '';
    document.getElementById('item' + (player.items.length + 1) + 'Text').innerText = '';
}

itemsCloseBtn.addEventListener('click', function() {
    itemsMenu.style.display = 'none';
});

//Player
const player = JSON.parse(localStorage.getItem('playerInfo')) || {
    health: 100,
    x: 60,
    y: 60,
    width: 30,
    height: 30,
    damage: 1,
    speed: 30,
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

//Health bar container object and draw function
const healthBarCon = {
    x: 60,
    y: 10,
    width: 200,
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
If player moves onto a tile that holds an item, that item is added to their inventory
*/
let backgroundItems = [
    {name: 'Medkit', background: 'Images/medkit.png', description: 'Medkit: Refills health by 50%', x: tileSize * 7, y: tileSize * 12, found: false},
    {name: 'Blue Phaser', background: 'Images/bluePhaser.png',  description: 'Blue Phaser: Increases damage by 1 for current mission', x: tileSize * 4, y: tileSize * 5, found: false}
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

function useItem(index) {
    if(player.items[index].name === 'Medkit') {
        player.health += 50;
    } else if(player.items[index].name === 'Blue Phaser') {
        player.damage += 1;
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
    if(e.clientX < 60 && e.clientY < 60) {
        console.log('Invalid Movement Area Clicked');
    } else if(!menuOpen && player.movement > 0) { 
    for(let i = 0; i < tiles.length; i++) {
        if( 
            e.clientX >= tiles[i].x
            && e.clientX < tiles[i].x + tiles[i].width
            && e.clientY >= tiles[i].y
            && e.clientY < tiles[i].y + tiles[i].height
            && tiles[i].solid === false) {
                if(player.x < tiles[i].x && player.movement - ((tiles[i].x - player.x) / 30) >= 0) {
                    if(player.y < tiles[i].y && player.movement - ((tiles[i].y - player.y) / 30) - ((tiles[i].x - player.x) / 30) >= 0) {
                        player.movement -= (((tiles[i].y - player.y) / 30) + ((tiles[i].x - player.x) / 30));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(player.y > tiles[i].y && player.movement - ((player.y - tiles[i].y) / 30) - ((tiles[i].x - player.x) / 30) >= 0){
                        player.movement -= (((player.y - tiles[i].y) / 30) + ((tiles[i].x - player.x) / 30));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(tiles[i].y === player.y) {
                        player.movement -= ((tiles[i].x - player.x) / 30);
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    }
                } else if(player.x > tiles[i].x && player.movement - ((player.x - tiles[i].x) / 30) >= 0){
                    if(player.y < tiles[i].y && player.movement - ((tiles[i].y - player.y) / 30) - ((player.x - tiles[i].x) / 30) >= 0) {
                        player.movement -= (((tiles[i].y - player.y) / 30) + ((tiles[i].x - player.x) / 30));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(player.y > tiles[i].y && player.movement - ((player.y - tiles[i].y) / 30) - ((player.x - tiles[i].x) / 30) >= 0){
                        player.movement -= (((player.y - tiles[i].y) / 30) + ((tiles[i].x - player.x) / 30));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(tiles[i].y === player.y) {
                        player.movement -= ((player.x - tiles[i].x) / 30);
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    }
                } else if(player.x === tiles[i].x) {
                    if(player.y < tiles[i].y && player.movement - ((tiles[i].y - player.y) / 30) - ((player.x - tiles[i].x) / 30) >= 0) {
                        player.movement -= (((tiles[i].y - player.y) / 30) + ((tiles[i].x - player.x) / 30));
                        player.y = tiles[i].y;
                        player.x = tiles[i].x;
                    } else if(player.y > tiles[i].y && player.movement - ((player.y - tiles[i].y) / 30) - ((player.x - tiles[i].x) / 30) >= 0){
                        player.movement -= (((player.y - tiles[i].y) / 30) + ((tiles[i].x - player.x) / 30));
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
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        if(!solidCollideRight && player.movement > 0) {
        player.x += player.speed;
        moving = true;
        player.movement -= 1;
    }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        if(!solidCollideLeft && player.movement > 0) {
        player.x -= player.speed;
        moving = true;
        player.movement -= 1;
    }
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = true;
        if(!solidCollideUp && player.movement > 0) {
        player.y -= player.speed;
        moving = true;
        player.movement -= 1;
    }
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = true;
        if(!solidCollideDown && player.movement > 0) {
        player.y += player.speed;
        moving = true;
        player.movement -= 1;
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
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
        moving = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
        moving = false;
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = false;
        moving = false;
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = false;
        moving = false;
    } 
}

/*
Turns 
-When players movement property is above 0, makes grid visible
-Once movement reaches 0, hides grid and allows enemies to move, then resets players movement property
*/

function turn() {
    if(player.movement > 0) {
        grid.style.display = 'grid';
    } else {
        grid.style.display = 'none';
        enemyMovement();
        player.movement = 5;
    }
}

//Enemies
class Enemy {
    constructor() {
        this.health = 50;
        this.defeated = false;
        this.width = 30; 
        this.height = 30;
        this.damage = 1;
        this.x = (Math.floor(Math.random() * 20)) * tileSize;
        this.y = (Math.floor(Math.random() * 20)) * tileSize;
        this.image = new Image();
        this.image.src = 'Images/greenMageV3.png';
    } draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

function createEnemies() {
for(let i = 0; i < 5; i++) {
    enemies.push(new Enemy());
    storedEnemies = enemies;
} 
}

function checkForSavedEnemies() {
if(localStorage.getItem('enemyInfo') != null) { 
    storedEnemies = JSON.parse(localStorage.getItem('enemyInfo'))
    for(let i = 0; i < storedEnemies.length; i++) {
        enemies.push(new Enemy());
        enemies[i].health = storedEnemies[i].health;
        enemies[i].x = storedEnemies[i].x;
        enemies[i].y = storedEnemies[i].y;
    }
} else {
    createEnemies();
}
}
checkForSavedEnemies()

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
        storedEnemies = enemies;
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

//Enemy Collision Detection
function enemyColDetect() {
    for(let i = 0; i < enemies.length; i++) {
    if(
        player.x < enemies[i].x + enemies[i].width && 
    player.x + player.width > enemies[i].x &&
    player.y < enemies[i].y + enemies[i].height &&
    player.y + player.height > enemies[i].y
    ){
        if(player.health > 0 && enemies[i].defeated === false) {    
        player.health -= enemies[i].damage;
        enemies[i].health -= player.damage;
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

function isTileUnderBuilding() {
    for(let i = 0; i < tiles.length; i++) {
        for(let j = 0; i < buildingsArray.length; i++) {
            if(tiles[i].x < buildingsArray[j].x + buildingsArray[j].width && 
                tiles[i].x + tiles[i].width > buildingsArray[j].x &&
                tiles[i].y < buildingsArray[j].y + buildingsArray[j].height &&
                tiles[i].y + tiles[i].height > buildingsArray[j].y) {
                    tiles[i].solid = true;
                }
        }
    }
}
isTileUnderBuilding();

/*Menu-
Listens for menu being clicked, based on selection-
--Save game saves player object and enemy array info to localStorage
--Delete save data removes items from localStorage
--Restart level reloads current page
--Exit game changes location to title screen
*/
menu.addEventListener('click', function() {
    menuOpen = true;
    if(menu.value === 'Save Game') {
        localStorage.setItem('playerInfo', JSON.stringify(player));
        localStorage.setItem('enemyInfo', JSON.stringify(storedEnemies));
        alert('Note: This game stores save data in the browser. If you clear your browser history, your game progress will be lost.');
        menu.value = blankOption;
    } else if(menu.value === 'Delete save data') {
        localStorage.clear();
        menu.value = blankOption;
    } else if(menu.value === 'Exit Game') {
        menu.value = blankOption;
        location.href = './index.html';
    } else if(menu.value === 'Load save file') {
        menu.value = blankOption;
        location.reload();
    } else if(menu.value === 'Items') {
        menu.value = blankOption;
        openedItemsMenu();
    }
    menuOpen = false;
});

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawHealthBar();
    drawPlayer();
    handleEnemies();
    enemyColDetect();
    solidColDetect();
    turn();
    requestAnimationFrame(animate);
}

animate();
