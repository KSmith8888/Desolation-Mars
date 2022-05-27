const canvas = document.getElementById('landingSiteCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;
let moving = false;

const grid = document.getElementById('grid');
const fsBackgroundEmpty = document.getElementById('fsBackgroundEmpty');
const playerImage = document.getElementById('playerImage');

const menu = document.getElementById('menu');
const blankOption = document.getElementById('blankOption');

//Background
function drawBackground() {
    ctx.drawImage(fsBackgroundEmpty, 0, 0, canvas.width, canvas.height);
}

//Player
const player = JSON.parse(localStorage.getItem('playerInfo')) || {
    health: 100,
    x: 50,
    y: 40,
    width: 24,
    height: 40,
    speed: 40,
    playerLevel: 1,
    gameLevel: 1,
    movement: 5
}

function drawPlayer() {
    if(player.x > canvas.width - player.width) {
        player.x = canvas.width - player.width;
    } else if(player.x < 0) {
        player.x = 0;
    } else if(player.y < 0) {
        player.y = 0;
    } else if(player.y > canvas.height - player.height) {
        player.y = canvas.height - player.height;
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
        player.x += player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        player.x -= player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = true;
        player.y -= player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
        }
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = true;
        player.y += player.speed;
        moving = true;
        if(player.movement > 0) {
            player.movement -= 1;
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

//Turns - Checks each loop to see if players movement property has reached zero and if it has, allows enemies to move before being reset
function endPlayerTurn() {
    if(player.movement === 0) {
        enemyMovement();
        player.movement = 5;
    }
}

//Enemies
class Enemy {
    constructor() {
        this.health = 50;
        this.width = 80; 
        this.height = 50;
        this.x = Math.floor(Math.random() * canvas.width);
        this.y = Math.floor(Math.random() * canvas.height);
        this.image = new Image();
        this.image.src = 'Images/greenMage.png';
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
        if(enemies[i].x > canvas.width - enemies[i].width) {
            enemies[i].x = canvas.width - enemies[i].width;
        } else if(enemies[i].x < 0) {
            enemies[i].x = 0;
        } else if(enemies[i].y < 0) {
            enemies[i].y = 0;
        } else if(enemies[i].y > canvas.height - enemies[i].height) {
            enemies[i].y = canvas.height - enemies[i].height;
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
        enemies[i].x += 80
    } else {
        enemies[i].x -= 80
    }
    if(player.y > enemies[i].y) {
        enemies[i].y += 80
    } else {
        enemies[i].y -= 80
    }
}
}


//Collission Detection
function colDetect() {
    for(let i = 0; i < enemies.length; i++) {
    if(
        player.x < enemies[i].x + enemies[i].width && 
    player.x + player.width > enemies[i].x &&
    player.y < enemies[i].y + enemies[i].height &&
    player.y + player.height > enemies[i].y
    ){
        if(player.health > 0) {    
        player.health -= 1;
        localStorage.setItem('playerInfo', JSON.stringify(player));
        }
        }
    }
}

//Grid to show player available spaces to move
// -Using CSS grid
if(!moving) {
    grid.style.display = 'none';
}

/* -Using JS/Canvas grid
let verticalLines = [];
let horizontalLines = [];
function createGrid() {
    for(let i = 0; i < canvas.width; i += 40) {
    verticalLines.push(i);
    }
    for(let k = 0; k < canvas.height; k += 40) {
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
*/

//Listens for menu being clicked, saves values of player object
menu.addEventListener('click', function() {
    if(menu.value === 'Save Game') {
        localStorage.setItem('playerInfo', JSON.stringify(player));
        localStorage.setItem('enemyInfo', JSON.stringify(storedEnemies));
        alert('Note: This game stores save data in the browser. If you clear your browser history, your game progress will be lost.');
        menu.value = blankOption;
    } else if(menu.value === 'Delete save data') {
        localStorage.removeItem('playerInfo');
        localStorage.removeItem('enemyInfo');
        menu.value = blankOption;
    } else if(menu.value === 'Exit Game') {
        location.href = './index.html';
        menu.value = blankOption;
    }
});

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    handleEnemies();
    colDetect();
    drawHealthBar();
    endPlayerTurn()
    //if(moving) {
    //drawGrid();
    //}
    requestAnimationFrame(animate);
}

animate();
