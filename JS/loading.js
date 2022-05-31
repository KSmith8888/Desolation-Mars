let savedInfo = {};

if(localStorage.getItem('playerInfo') != null) { 
    savedInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if(savedInfo.gameLevel === 1) {
        location.href = './landingSite.html';
    }
} else {
    location.href = './index.html';
}
