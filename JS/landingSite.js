const canvas = document.getElementById('landingSiteCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

const fsBackgroundEmpty = document.getElementById('fsBackgroundEmpty');
const playerImage = new Image();
playerImage.src = 'Images/playerV2.png';

//Player
const player = {
    health: 100,
    x: 50,
    y: 50,
    width: 24,
    height: 40,
    speed: 5
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
    x: 10,
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
    ctx.lineTo(healthBarCon.x, healthBarCon.x + healthBarCon.height);
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
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
        player.x -= player.speed;
    }
    else if(e.key == 'Up' || e.key == 'ArrowUp') {
        upPressed = true;
        player.y -= player.speed;
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = true;
        player.y += player.speed;
    } 
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == 'Up' || e.key == 'UpArrow') {
        upPressed = false;
    }
    else if(e.key == 'Down' || e.key == 'ArrowDown') {
        downPressed = false;
    } 
}

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

function createEnemies() {
for(let i = 0; i < 5; i++) {
    enemies.push(new Enemy());
}
}
createEnemies();

function handleEnemies() {
    for(let i = 0; i < enemies.length; i++) {
        if(enemies[i].x > canvas.width) {
            enemies[i].x = canvas.width - enemies[i].width;
        } else if(enemies[i].x < 0) {
            enemies[i].x = 0;
        } else if(enemies[i].y < 0) {
            enemies[i].y = 0;
        } else if(enemies[i].y > canvas.height) {
            enemies[i].y = canvas.height - enemies[i].height;
        }
        if(enemies[i].health > 0) {
        enemies[i].draw();
        }
    }
    }

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
        }
        }
    }
}

//Background
function drawBackground() {
    ctx.drawImage(fsBackgroundEmpty, 0, 0, canvas.width, canvas.height);
}

//Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayer();
    handleEnemies();
    colDetect();
    drawHealthBar();
    requestAnimationFrame(animate);
}

animate();
