  const tabItem = document.querySelectorAll('.tabs__btn-item');
  const tabContent = document.querySelectorAll('.tabs__content-item');
  

  tabItem.forEach(function(element) {
    element.addEventListener('click', open);
  })

  function open(evt) {
    const tabTarget = evt.currentTarget;
    const button = tabTarget.dataset.button;

    tabItem.forEach(function(item){
      item.classList.remove('tabs__btn-item--active');
    });

    tabTarget.classList.add('tabs__btn-item--active');

    tabContent.forEach(function(item){
      item.classList.remove('tabs__content-item--active');
    });

    document.querySelector(`#${button}`).classList.add('tabs__content-item--active');


  };


  
  const menuBtn = document.querySelector('.menu__btn');
  const menu = document.querySelector('.menu__list');
  const menuLinks = document.querySelectorAll('.menu__list-link');
  const body = document.body; // Добавляем переменную для body

  // 1. Открытие/закрытие по клику на бургер
  menuBtn.addEventListener('click', () => {
    menu.classList.toggle('menu__list--active');
    body.classList.toggle('lock'); // Блокируем или разблокируем скролл
  });

  // 2. Закрытие при клике на ссылку
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('menu__list--active');
      body.classList.remove('lock'); // Обязательно снимаем блок при переходе по ссылке
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("callbackForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Дякуємо! Наш менеджер скоро зателефонує вам.");
    form.reset();
  });
});



  

  const swiper = new Swiper(".swiper", {
    effect: "fade",
    pagination: {
      el: ".swiper-pagination",
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    
  });

  

