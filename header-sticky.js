/* Скрипт подключить перед закрывающим </body> (после main.js или вместо) */
(function () {
  const header = document.querySelector('.header-main');
  if (!header) return;

  // Функция обновления состояния шапки
  function updateHeaderState() {
    const headerHeight = header.offsetHeight || 0;
    // Порог: высота видимой области (hero/слайдер) минус высота шапки.
    // Это хорошо работает если у вас стартовый экран занимает 100vh (swiper-slide).
    const threshold = window.innerHeight - headerHeight;

    if (window.scrollY > threshold) {
      if (!header.classList.contains('header--fixed')) {
        header.classList.add('header--fixed');
        // Добавляем отступ у body, чтобы контент не прыгал при переключении в fixed
        // document.body.style.paddingTop = headerHeight + 'px';
      }
    } else {
      if (header.classList.contains('header--fixed')) {
        header.classList.remove('header--fixed');
        document.body.style.paddingTop = '';
      }
    }
  }

  // Обновляем при загрузке, скролле и ресайзе
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  window.addEventListener('resize', updateHeaderState);
  document.addEventListener('DOMContentLoaded', updateHeaderState);
})();