const introContainer = document.getElementById('introContainer');
const arrowRight = document.getElementById('arrowRight');
const transmissionContainer = document.getElementById('transmissionContainer');
const arrowRight2 = document.getElementById('arrowRight2');
arrowRight.focus();

transmissionContainer.style.display = 'none';
arrowRight2.style.display = 'none';

arrowRight.addEventListener('click', function() {
    introContainer.style.display = 'none';
    arrowRight.style.display = 'none';
    transmissionContainer.style.display = 'contents';
    arrowRight2.style.display = 'grid';
    arrowRight2.focus();
});

arrowRight2.addEventListener('click', function() {
    location.href = './wasteland.html';
});
