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
let buildingCollideRight = false;
let buildingCollideLeft = false;
let buildingCollideUp = false;
let buildingCollideDown = false;

const grid = document.getElementById('grid');
const fsBackgroundEmpty = document.getElementById('fsBackgroundEmpty');
const playerImage = document.getElementById('playerImage');

const menu = document.getElementById('menu');
const blankOption = document.getElementById('blankOption');

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

//Background
function drawBackground() {
    ctx.drawImage(fsBackgroundEmpty, 0, 0, canvas.width, canvas.height);
}

//Player
const player = JSON.parse(localStorage.getItem('playerInfo')) || {
    health: 100,
    x: 60,
    y: 60,
    width: 30,
    height: 30,
    speed: tileSize,
    playerLevel: 1,
    gameLevel: 1,
    movement: 5
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
    x: 50,
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

//Key Events
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
        if(!buildingCollideRight) {
        player.x += player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
    }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        if(!buildingCollideLeft) {
        player.x -= player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
    }
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = true;
        if(!buildingCollideUp) {
        player.y -= player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
    }
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = true;
        if(!buildingCollideDown) {
        player.y += player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
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
        this.width = 30; 
        this.height = 30;
        this.x = (Math.floor(Math.random() * 10)) * tileSize;
        this.y = (Math.floor(Math.random() * 10)) * tileSize;
        this.image = new Image();
        this.image.src = 'Images/greenMageV3.png';
    } draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

let enemies = [];
let storedEnemies = [];

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
        storedEnemies = enemies;
        }
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
        if(player.health > 0) {    
        player.health -= 1;
        ctx.font = '16px serif';
        ctx.fillText('Ouch', player.x - 5, player.y - 10);
        }
        }
    }
}

//Creates dynamic JS grid to control movement
//Visible grid is CSS only and becomes visible during players turn

let verticalLines = [];
let horizontalLines = [];

function createGrid() {
    for(let i = 0; i < canvas.width; i += tileSize) {
    verticalLines.push(i);
    }
    for(let k = 0; k < canvas.height; k += tileSize) {
    horizontalLines.push(k);
    }
}
createGrid();

function drawGrid() {
    for(let j = 0; j < verticalLines.length; j++) {
    ctx.strokeStyle = 'grey';
    ctx.beginPath();
    ctx.moveTo(verticalLines[j], 0);
    ctx.lineTo(verticalLines[j], canvas.height);
    ctx.stroke()
    }
    for(let l = 0; l < horizontalLines.length; l++) {
    ctx.strokeStyle = 'grey';
    ctx.beginPath();
    ctx.moveTo(0, verticalLines[l]);
    ctx.lineTo(canvas.width, verticalLines[l]);
    ctx.stroke()
    }
}
drawGrid();

/*Buildings
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

function drawBuildings() { 
    ctx.drawImage(vertBarImage, verticalBarrier1.x, verticalBarrier1.y, verticalBarrier1.width, verticalBarrier1.height);
    ctx.drawImage(horBarImage, horizontalBarrier1.x, horizontalBarrier1.y, horizontalBarrier1.width, horizontalBarrier1.height);
    ctx.drawImage(destFortImage, destroyedFort1.x, destroyedFort1.y, destroyedFort1.width, destroyedFort1.height);
}

//Building Collision Detection
function buildingColDetect() {
    buildingCollideRight = false;
    buildingCollideLeft = false;
    buildingCollideUp = false;
    buildingCollideDown = false;
    for(let i = 0; i < buildingsArray.length; i++) {
        if( 
        player.x + player.width === buildingsArray[i].x &&
        player.y < buildingsArray[i].y + buildingsArray[i].height &&
        player.y + player.height > buildingsArray[i].y) {
            buildingCollideRight = true;
        }
        if(
        player.x === buildingsArray[i].x + buildingsArray[i].width &&
        player.y < buildingsArray[i].y + buildingsArray[i].height &&
        player.y + player.height > buildingsArray[i].y) {
            buildingCollideLeft = true;
        } 
        if(
        player.y === buildingsArray[i].y + buildingsArray[i].height &&
        player.x >= buildingsArray[i].x &&
        player.x < buildingsArray[i].x + buildingsArray[i].width) {
            buildingCollideUp = true;
        } 
        if(
        player.y + player.height === buildingsArray[i].y &&
        player.x >= buildingsArray[i].x &&
        player.x < buildingsArray[i].x + buildingsArray[i].width
        ) {
            buildingCollideDown = true;
        }
}
}

/*Menu-
Listens for menu being clicked, based on selection-
--Save game saves player object and enemy array info to localStorage
--Delete save data removes items from localStorage
--Restart level reloads current page
--Exit game changes location to title screen
*/
menu.addEventListener('click', function() {
    if(menu.value === 'Save Game') {
        localStorage.setItem('playerInfo', JSON.stringify(player));
        localStorage.setItem('enemyInfo', JSON.stringify(storedEnemies));
        alert('Note: This game stores save data in the browser. If you clear your browser history, your game progress will be lost.');
        menu.value = blankOption;
    } else if(menu.value === 'Delete save data') {
        localStorage.clear();
        menu.value = blankOption;
    } else if(menu.value === 'Exit Game') {
        location.href = './index.html';
        //menu.value = blankOption;
    } else if(menu.value === 'Load save file') {
        menu.value = blankOption;
        location.reload();
    }
});

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawBuildings();
    drawPlayer();
    handleEnemies();
    enemyColDetect();
    buildingColDetect();
    drawHealthBar();
    turn();
    requestAnimationFrame(animate);
}

animate();
