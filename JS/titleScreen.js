const startGameBtn = document.getElementById('startGameBtn');
const continueGameBtn = document.getElementById('continueGameBtn');
const optionsBtn = document.getElementById('optionsBtn');
let savedInfo = {};

//Start new game button sends user to level 1
startGameBtn.addEventListener('keydown', function(e) {
    if(e.key == 'enter') {
        location.href = './landingSite.html';
    }
});

startGameBtn.addEventListener('click', function() {
    location.href = './landingSite.html';
});

/*
Continue game button accesses saved player info if it is present in local storage, sets player object values to match saved info and sends user to correct level
*/
continueGameBtn.addEventListener('keydown', function(e) {
    if(e.key == 'enter') {
        if(localStorage.getItem('playerInfo') != null) { 
            savedInfo = JSON.parse(localStorage.getItem('playerInfo'));
            if(savedInfo.gameLevel === 1) {
                location.href = './landingSite.html';
            }
        } else {
            alert('No save data found, please start a new game.');
        }
    }
});

continueGameBtn.addEventListener('click', function() {
if(localStorage.getItem('playerInfo') != null) { 
    savedInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if(savedInfo.gameLevel === 1) {
        location.href = './landingSite.html';
    }
} else {
    alert('No save data found, please start a new game.');
}
});
