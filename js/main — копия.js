


let menuBtn = document.querySelector('.menu__btn');
let menu = document.querySelector('.menu__list');
menuBtn.addEventListener('click', function(){
	menuBtn.classList.toggle('active');
	menu.classList.toggle('active');
})
