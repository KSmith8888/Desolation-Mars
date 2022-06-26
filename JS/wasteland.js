const arrowRight1 = document.getElementById('arrowRight1');
const arrowRight2 = document.getElementById('arrowRight2');
arrowRight2.style.display = 'none';
let text1 = document.getElementById('text1');
let text2 = document.getElementById('text2');

arrowRight1.addEventListener('click', function() {
    text2.style.display = 'none';
    arrowRight1.style.display = 'none';
    text1.innerText = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum at suscipit velit culpa est corrupti perferendis deleniti officiis eum ipsa, doloremque optio maiores perspiciatis beatae eaque sed eveniet, tenetur iure sint! Harum facere autem hic quidem molestias beatae possimus dolores quisquam eos, nostrum voluptas porro tenetur, accusantium earum reiciendis vel accusamus veritatis odio est praesentium ullam sint ut temporibus consectetur. Neque tenetur praesentium at sed minus, porro eligendi! Voluptatem atque ex, id qui corporis inventore.';
    arrowRight2.style.display = 'grid';
});

arrowRight2.addEventListener('click', function() {
    alert('Level 1: The Landing Site');
    location.href = './landingSite.html';
});
