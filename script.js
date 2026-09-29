document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const modalForm = document.getElementById('modalForm');
  const tgQuick = document.getElementById('tgQuick');
  
  // Кнопки и карточки
  const mainTabs = document.querySelectorAll('.main-tab');
  const categoryBtns = document.querySelectorAll('.category-btn');
  const subpanel = document.getElementById('category-subpanel');
  const cards = document.querySelectorAll('.card');

  // Элементы модального окна
  const modal = document.getElementById('modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('[data-close]');
  const modalProductInput = document.getElementById('mproduct');
  const modalHiddenProduct = document.getElementById('modalProduct');
  
  // Элементы модалки для деталей
  const modalTitle = document.getElementById('modalTitle');
  const modalDescBox = document.getElementById('modalDescription');
  const modalImgContainer = document.getElementById('modalImageContainer');
  const modalImg = document.getElementById('modalImage');
  const buyFromDetailsBtn = document.getElementById('buyFromDetails');
  
  const header = document.getElementById('siteHeader');
  const hero = document.getElementById('hero');
  const reveals = document.querySelectorAll('.reveal');

  let activeCategory = 'shampoo'; // Категория по умолчанию

  // --- БАЗА ДАННЫХ БРЕНДОВ ДЛЯ БАННЕРА ---
  const BRANDS_DATA = {
    balmain: {
      title: "Balmain Hair Couture",
      country: "Франція 🇫🇷",
      logo: "./images/brands/balmain-logo.png",
      desc: "Розкішний догляд та стайлінг від видатного французького дому моди. Продукція поєднує в собі кутюрний шик, передові формули на основі протеїнів шовку та арганової олії."
    },
    hadat: {
      title: "Hadat Cosmetics",
      country: "Ізраїль 🇮🇱",
      logo: "./images/brands/hadat-logo.png",
      desc: "Професійна косметика для волосся, що поєднує натуральні олії, екстракти водоростей та запатентовану технологію Sea Oil Silk для глибокого відновлення."
    },
    lebel: {
      title: "Lebel",
      country: "Японія 🇯🇵",
      logo: "./images/brands/lebel-logo.png",
      desc: "Інноваційна японська косметика для догляду за волоссям та шкірою голови, яка поєднує передові нанотехнології та традиційні природні компоненти."
    },
    medik8: {
      title: "Medik8",
      country: "Великобританія 🇬🇧",
      logo: "./images/brands/medik8-logo.png",
      desc: "Експертний догляд за шкірою на основі доказової медицини. Спеціалізується на вітаміні C та ретинолі для досягнення молодості та здоров'я шкіри."
    },
    mediceuticals: {
      title: "Mediceuticals",
      country: "США 🇺🇸",
      logo: "./images/brands/mediceuticals-logo.png",
      desc: "Дерматологічні рішення для трихологічних проблем: випадіння волосся, виснаження та лікування шкіри голови."
    },
    oribe: {
      title: "Oribe",
      country: "США 🇺🇸",
      logo: "./images/brands/oribe-logo.png",
      desc: "Бескомпромісна розкіш у світі стайлінгу та догляду за волоссям. Вишукані аромати, бестселери для об'єму та унікальні текстури."
    },
    rejuran: {
      title: "Rejuran",
      country: "Південна Корея 🇰🇷",
      logo: "./images/brands/rejuran-logo.png",
      desc: "Преміальна космецевтика на основі полінуклеотидів (c-PDRN), що стимулює клітинну регенерацію та омолодження шкіри."
    },
    xiaomoxuan: {
      title: "Xiaomoxuan",
      country: "Тайвань 🇹🇼",
      logo: "./images/brands/xiaomoxuan-logo.png",
      desc: "Натуральний догляд на основі листя чаю. Відновлює навіть найпошкодженіше волосся, надаючи дзеркального блиску та шовковистості."
    }
  };

  // --- ФУНКЦИЯ ОБНОВЛЕНИЯ БАННЕРА БРЕНДА ---
  function updateBrandBanner(brandName) {
    const banner = document.getElementById('brand-info-banner');
    if (!banner) return;

    const key = brandName ? brandName.trim().toLowerCase() : '';

    if (!key || key === 'all' || key === 'bestsellers' || key === 'бестселери' || key === 'все' || !BRANDS_DATA[key]) {
      banner.classList.add('hidden');
      return;
    }

    const data = BRANDS_DATA[key];

    const titleEl = document.getElementById('brand-title');
    const countryEl = document.getElementById('brand-country');
    const logoEl = document.getElementById('brand-logo');
    const descEl = document.getElementById('brand-description');

    if (titleEl) titleEl.textContent = data.title;
    if (countryEl) countryEl.textContent = data.country;
    if (logoEl) logoEl.src = data.logo;
    if (descEl) descEl.textContent = data.desc;

    banner.classList.remove('hidden');
  }

  function showToast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; }, 3000);
    setTimeout(() => { t.remove(); }, 3700);
  }

  async function sendToPhp(formData) {
    try {
      const response = await fetch('send.php', { method: 'POST', body: formData });
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      return { status: 'error' };
    }
  }

  // --- УПРАВЛЕНИЕ ДВУХУРОВНЕВОЙ ФИЛЬТРАЦИЕЙ (ФИЛЬТРЫ / БРЕНДЫ) ---
  mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Сбрасываем стили всех главных табов к неактивным
      mainTabs.forEach(t => {
        t.dataset.active = 'false';
        t.className = 'main-tab px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors';
      });

      // 2. Активируем нажатую кнопку (делаем черной)
      tab.dataset.active = 'true';
      tab.className = 'main-tab px-4 py-2 text-sm font-semibold rounded-md transition-all bg-black text-white shadow-sm';

      const type = tab.dataset.type;
      const brand = tab.dataset.brand || tab.getAttribute('data-brand');

      if (type === 'filters') {
        // Показываем под-панель категорий
        if (subpanel) subpanel.style.display = 'flex';
        filterByCategory(activeCategory);
        updateBrandBanner('');
      } else {
        // Прячем под-панель категорий при выборе Бренда
        if (subpanel) subpanel.style.display = 'none';
        filterByBrand(brand);
        updateBrandBanner(brand);
      }
    });
  });

  // Переключение внутри под-панели категорий (Шампуни / Кондиционеры / Маски)
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => {
        b.className = 'category-btn px-5 py-2.5 rounded-full text-sm font-semibold transition-all bg-gray-100 text-gray-600 border border-transparent hover:bg-gray-200';
      });

      btn.className = 'category-btn active-category px-5 py-2.5 rounded-full text-sm font-semibold transition-all bg-white text-gray-900 border border-gray-300 shadow-md';

      activeCategory = btn.dataset.category || btn.getAttribute('data-category');
      filterByCategory(activeCategory);
    });
  });

  function filterByCategory(category) {
    cards.forEach(card => {
      const cardCategory = (card.dataset.category || card.getAttribute('data-category') || '').toLowerCase();
      if (cardCategory === (category || '').toLowerCase()) {
        card.style.display = '';
        requestAnimationFrame(() => { card.classList.add('visible'); });
      } else {
        card.style.display = 'none';
        card.classList.remove('visible');
      }
    });
  }

  function filterByBrand(brand) {
    cards.forEach(card => {
      const cardBrand = (card.dataset.brand || card.getAttribute('data-brand') || '').toLowerCase();
      if (cardBrand === (brand || '').toLowerCase()) {
        card.style.display = '';
        requestAnimationFrame(() => { card.classList.add('visible'); });
      } else {
        card.style.display = 'none';
        card.classList.remove('visible');
      }
    });
  }

  // --- Управление модальным окном (Режимы: Детали / Заказ) ---
  function openModal(productName, mode = 'order', description = '', imgSrc = '') {
    if (!modal) return;
    
    modal.classList.add('active');
    modal.classList.remove('pointer-events-none');
    document.body.style.overflow = 'hidden';

    if (modalProductInput) modalProductInput.value = productName;
    if (modalHiddenProduct) modalHiddenProduct.value = productName;

    if (mode === 'details') {
      if (modalTitle) modalTitle.textContent = productName;
      if (modalDescBox) modalDescBox.innerHTML = description;
      
      if (modalDescBox) modalDescBox.classList.remove('hidden');
      if (imgSrc && modalImgContainer && modalImg) {
          modalImg.src = imgSrc;
          modalImgContainer.classList.remove('hidden');
      }
      
      if (modalForm) modalForm.classList.add('hidden');
      if (buyFromDetailsBtn) buyFromDetailsBtn.classList.remove('hidden');
    } else {
      if (modalTitle) modalTitle.textContent = 'Оформити замовлення';
      if (modalDescBox) modalDescBox.classList.add('hidden');
      if (modalImgContainer) modalImgContainer.classList.add('hidden');
      if (modalForm) modalForm.classList.remove('hidden');
      if (buyFromDetailsBtn) buyFromDetailsBtn.classList.add('hidden');
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }

  // Делегирование кликов для модалок
  document.addEventListener('click', (e) => {
    const orderBtn = e.target.closest('.order-btn');
    const detailsBtn = e.target.closest('.details-btn');

    if (orderBtn) {
      openModal(orderBtn.dataset.product, 'order');
    }
    if (detailsBtn) {
      openModal(
          detailsBtn.dataset.product, 
          'details', 
          detailsBtn.dataset.description, 
          detailsBtn.dataset.image
      );
    }
  });

  // --- ПЕРЕКЛЮЧЕНИЕ ОБЪЕМОВ КНОПКАМИ (.size-btn, например Hadat) ---
  document.addEventListener('click', (e) => {
    const sizeBtn = e.target.closest('.size-btn');
    if (!sizeBtn) return;

    const card = sizeBtn.closest('.card');
    if (!card) return;

    const sizeButtons = card.querySelectorAll('.size-btn');
    const priceDisplay = card.querySelector('.price-display, .product-price');
    const sizeText = card.querySelector('.product-size-text');
    const imgEl = card.querySelector('.product-image, img');
    const orderBtn = card.querySelector('.order-btn');
    const detailsBtn = card.querySelector('.details-btn');
    const brand = card.getAttribute('data-brand') || '';
    const productName = card.querySelector('h4, .product-title')?.textContent.trim() || '';

    sizeButtons.forEach(btn => {
      btn.classList.remove('active', 'border-blue-600', 'bg-blue-50', 'text-blue-600');
      btn.classList.add('border-gray-300', 'text-gray-700');
    });

    sizeBtn.classList.add('active', 'border-blue-600', 'bg-blue-50', 'text-blue-600');
    sizeBtn.classList.remove('border-gray-300', 'text-gray-700');

    const newPrice = sizeBtn.dataset.price;
    const newSize = sizeBtn.dataset.size;
    const newTitle = sizeBtn.dataset.title;
    const newImage = sizeBtn.dataset.image;
    const customDetailsProduct = sizeBtn.dataset.productDetails;
    const customOrderProduct = sizeBtn.dataset.productOrder;

    let formattedPrice = newPrice;
    if (newPrice && !isNaN(newPrice.replace(/\s/g, ''))) {
      formattedPrice = Number(newPrice.replace(/\s/g, '')).toLocaleString('uk-UA') + ' грн';
    }

    if (priceDisplay && formattedPrice) priceDisplay.textContent = formattedPrice;
    if (sizeText && newTitle) sizeText.textContent = newTitle;
    if (imgEl && newImage) imgEl.src = newImage;

    if (orderBtn) {
      orderBtn.dataset.product = customOrderProduct || `${brand} — ${productName} (${newSize || ''}) ${newPrice || ''}`.trim();
    }
    if (detailsBtn) {
      detailsBtn.dataset.product = customDetailsProduct || `${productName} (${newSize || ''}) ${newPrice || ''}`.trim();
      if (newImage) detailsBtn.dataset.image = newImage;
    }
  });

  // --- ПЕРЕКЛЮЧЕНИЕ ОБЪЕМОВ ВЫПАДАЮЩИМ СПИСКОМ (.volume-select, например Lebel) ---
  document.addEventListener('change', (e) => {
    if (!e.target.classList.contains('volume-select')) return;

    const select = e.target;
    const selectedOption = select.options[select.selectedIndex];
    const card = select.closest('.card');
    if (!card) return;

    const price = selectedOption.dataset.price;
    const title = selectedOption.dataset.title;
    const image = selectedOption.dataset.image;
    const productDetails = selectedOption.dataset.productDetails;
    const productOrder = selectedOption.dataset.productOrder;
    const description = selectedOption.dataset.description;

    const imgEl = card.querySelector('.product-image, img');
    if (imgEl && image) imgEl.src = image;

    const priceEl = card.querySelector('.product-price, .price-display');
    if (priceEl && price) priceEl.textContent = price;

    const titleEl = card.querySelector('.product-title, h4');
    if (titleEl && title) titleEl.textContent = title;

    const detailsBtn = card.querySelector('.details-btn');
    if (detailsBtn) {
      if (productDetails) detailsBtn.dataset.product = productDetails;
      if (image) detailsBtn.dataset.image = image;
      if (description) detailsBtn.dataset.description = description;
    }

    const orderBtn = card.querySelector('.order-btn');
    if (orderBtn && productOrder) {
      orderBtn.dataset.product = productOrder;
    }
  });

  if (buyFromDetailsBtn) {
    buyFromDetailsBtn.addEventListener('click', () => {
      openModal(modalProductInput.value, 'order');
    });
  }

  modalCloseBtns.forEach(b => b.addEventListener('click', closeModal));
  if (modalOverlay) modalOverlay.addEventListener('click', closeModal);

  // --- Отправка модальной формы ---
  if (modalForm) {
    modalForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const pname = modalHiddenProduct.value || modalProductInput.value;
      const mname = document.getElementById('mname').value.trim();
      const mphone = document.getElementById('mphone').value.trim();
      const mpromo = document.getElementById('mPromo').value.trim();
      if (!mname || !mphone) {
        showToast('Укажіть ім\'я та телефон.');
        return;
      }

      const formData = new FormData();
      formData.append('product', pname);
      formData.append('name', mname);
      formData.append('phone', mphone);
      formData.append('promo', mpromo);

      showToast('Надсилаємо...');
      const result = await sendToPhp(formData);
      if (result.status === 'success') {
        showToast('Замовлення прийнято!');
        closeModal();
        modalForm.reset();
      } else {
        showToast('Помилка при відправці.');
      }
    });
  }

  // --- ИНИЦИАЛИЗАЦИЯ СТРАНИЦЫ ---
  // Проверяем параметр ?brand= в URL
  const urlParams = new URLSearchParams(window.location.search);
  const brandFromUrl = urlParams.get('brand');

  if (brandFromUrl && mainTabs.length) {
    const targetBrand = brandFromUrl.trim().toLowerCase();

    mainTabs.forEach(t => {
      const tabBrand = (t.dataset.brand || t.getAttribute('data-brand') || '').toLowerCase();
      if (tabBrand === targetBrand) {
        t.dataset.active = 'true';
        t.className = 'main-tab px-4 py-2 text-sm font-semibold rounded-md transition-all bg-black text-white shadow-sm';
      } else {
        t.dataset.active = 'false';
        t.className = 'main-tab px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors';
      }
    });

    if (subpanel) subpanel.style.display = 'none';
    filterByBrand(targetBrand);
    updateBrandBanner(targetBrand);
  } else {
    // По умолчанию активируем фильтр по категориям ("Шампуні")
    if (subpanel) subpanel.style.display = 'flex';
    filterByCategory(activeCategory);
  }

  // --- ЭФФЕКТЫ СКРОЛЛА И ШАПКИ ---
  function runReveal() {
    reveals.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight - 80) el.classList.add('visible');
    });
  }

  let heroHeight = 0;
  function measureHeights() { heroHeight = hero ? hero.offsetHeight : 0; }
  function onScrollHeader() {
    if (!header) return;
    window.scrollY > heroHeight - 1 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
  }

  window.addEventListener('scroll', () => { runReveal(); onScrollHeader(); }, { passive: true });
  window.addEventListener('resize', () => { setTimeout(measureHeights, 120); });

  measureHeights();
  runReveal();
  onScrollHeader();

  // Нижняя форма подписки/заявки
  const contactFormBottom = document.getElementById('contactFormBottom');
  if (contactFormBottom) {
    contactFormBottom.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      formData.append('product', 'Заявка з нижньої форми');

      showToast('Надсилаємо заявку...');
      const result = await sendToPhp(formData);
      
      if (result.status === 'success') {
        showToast('Дякуємо! Скоро зв’яжемося.');
        this.reset();
      }
    });
  }
});

// --- БЛОК ПРИВЕТСТВЕННОЙ СКИДКИ ---
document.addEventListener('DOMContentLoaded', function() {
  const discountModal = document.getElementById('discountModal');
  
  function openDiscountModal() {
    if (discountModal && !sessionStorage.getItem('discountShown')) {
      discountModal.classList.remove('hidden');
      discountModal.classList.add('flex');
      sessionStorage.setItem('discountShown', 'true');
    }
  }

  setTimeout(openDiscountModal, 5000);
});

window.closeDiscountModal = function() {
  const dModal = document.getElementById('discountModal');
  const promoInput = document.getElementById('mPromo');

  if (dModal) {
    dModal.classList.add('hidden');
    dModal.classList.remove('flex');
  }

  if (promoInput) {
    promoInput.value = 'WELCOME10';
  }
};