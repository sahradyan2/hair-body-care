// Core JS for interactivity (pure JS)

// Simple dataset to demonstrate search/filter and table
const DATA = [
  {id: '0x3fc91a3afd70395cd4...', name: 'ООО "Север"', type: 'company', country: 'ru', status: 'active'},
  {id: 'TJL3Y3oXqvBFYaKYc2g5...', name: 'Иванов Иван', type: 'person', country: 'ru', status: 'active'},
  {id: 'bc1axy2kgdygjrsqtz92...', name: 'Nova Ltd', type: 'company', country: 'uk', status: 'inactive'},
  {id: 'P-555', name: 'John Doe', type: 'person', country: 'us', status: 'inactive'},
  {id: 'C-777', name: 'Alpha Holdings', type: 'company', country: 'us', status: 'active'},
  {id: 'P-202', name: 'Петров Сергей', type: 'person', country: 'ru', status: 'active'},
];

// Utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initModals();
  initSearch();
  initCTAs();
  setYear();
});



// Header: mobile menu toggle
function initHeader(){
  const mobileBtn = $$('#mobileMenuBtn, #mobileMenuBtn2, #mobileMenuBtn3, #mobileMenuBtn4').find(Boolean) || $('#mobileMenuBtn');
  // handle multiple IDs if present on different pages
  $$('#mobileMenuBtn, #mobileMenuBtn2, #mobileMenuBtn3, #mobileMenuBtn4').forEach(btn=>{
    if(!btn) return;
    btn.addEventListener('click', ()=>{
      const nav = btn.closest('.header-inner').querySelector('.main-nav');
      if(nav){
        const shown = nav.style.display === 'block';
        nav.style.display = shown ? '' : 'block';
      }
    });
  });
  
  
}



// Modals
function initModals(){
  const overlay = $('#modalOverlay') || $('#modalOverlayAbout');
  const openAuthBtns = $$('#openAuth, #openAuth2, #openAuth3, #openAuth4').filter(Boolean);
  const openFbBtns = $$('#openFeedback, #openFeedback2, #openFeedback3, #openFeedback4').filter(Boolean);
  const authModal = $('#authModal') || $('#authModalAbout');
  const fbModal = $('#feedbackModal');

  function openModal(modal){
    document.documentElement.classList.add('modal-open');
    if(overlay) overlay.style.display = 'block';
    if(modal) modal.style.display = 'block';
    setTimeout(()=> {
      document.documentElement.classList.add('modal-open');
      if(overlay) overlay.classList.add('visible');
      if(modal) modal.classList.add('visible');
    },10);
  }
  function closeModal(modal){
    document.documentElement.classList.remove('modal-open');
    if(overlay) overlay.classList.remove('visible');
    if(modal) modal.classList.remove('visible');
    setTimeout(()=>{
      if(overlay) overlay.style.display = '';
      if(modal) modal.style.display = '';
    },180);
  }

  openAuthBtns.forEach(btn=>btn.addEventListener('click', ()=> openModal(authModal)));
  openFbBtns.forEach(btn=>btn.addEventListener('click', ()=> openModal(fbModal)));

  // Close buttons (data-close)
  $$('[data-close]').forEach(btn=>btn.addEventListener('click', (e)=>{
    const modal = e.target.closest('.modal');
    closeModal(modal);
  }));

  // Overlay click
  if(overlay){
    overlay.addEventListener('click', ()=>{
      // close any visible modal
      $$('.modal.visible').forEach(m=>closeModal(m));
    });
  }

  // Esc to close
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      $$('.modal.visible').forEach(m=>closeModal(m));
    }
  });

  // Simple auth submit
  const authForm = $('#authForm') || $('#authFormAbout');
  if(authForm){
    authForm.addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Демо: форма входа отправлена.');
      const modal = authForm.closest('.modal');
      if(modal) closeModal(modal);
    });
  }

  if($('#feedbackForm')){
    $('#feedbackForm').addEventListener('submit', (e)=>{
      e.preventDefault();
      alert('Спасибо! Ваше сообщение отправлено (демо).');
      const modal = $('#feedbackForm').closest('.modal');
      if(modal) closeModal(modal);
    });
  }
}

// CTA buttons
function initCTAs(){
  const quick = $('#quickSearchBtn');
  if(quick){
    quick.addEventListener('click', ()=>{
      // scroll to search section if present
      const search = document.getElementById('search');
      if(search){
        search.scrollIntoView({behavior:'smooth', block:'start'});
        // focus query
        setTimeout(()=>{ const q = document.getElementById('q'); if(q) q.focus(); },300);
      }
    });
  }
  const learn = $('#learnMoreBtn');
  if(learn) learn.addEventListener('click', ()=> {
    const services = document.getElementById('services');
    if(services) services.scrollIntoView({behavior:'smooth'});
  });
}

// Search / Filter
function initSearch(){
  const tbody = $('#resultsTable tbody');
  if(!tbody) return;

  // render initial data
  function renderRows(list){
    tbody.innerHTML = '';
    if(list.length === 0){
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 6;
      td.style.color = 'var(--muted)';
      td.textContent = 'Ничего не найдено';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    list.forEach(item=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.id}</td>
        <td>${escapeHtml(item.name)}</td>
        <td>${capitalize(item.type)}</td>
        <td>${countryName(item.country)}</td>
        <td>${capitalize(item.status)}</td>
        <td>
          <button class="action-btn btn btn-outline" data-id="${item.id}">Открыть</button>
          <button class="action-btn btn btn-primary" data-id="${item.id}">Отчёт</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function escapeHtml(s){
    return (s + '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  }

  function capitalize(s){
    if(!s) return s;
    return s[0].toUpperCase() + s.slice(1);
  }

  function countryName(code){
    switch(code){
      case 'ru': return 'Россия';
      case 'us': return 'США';
      case 'uk': return 'Великобритания';
      default: return code;
    }
  }

  renderRows(DATA);

  const doSearchBtn = $('#doSearch');
  const resetBtn = $('#resetSearch');

  function performFilter(){
    const q = (document.getElementById('q') || {}).value || '';
    const type = (document.getElementById('type') || {}).value || '';
    const country = (document.getElementById('country') || {}).value || '';
    const sanctions = !!document.getElementById('chkSanctions') && document.getElementById('chkSanctions').checked;
    const pep = !!document.getElementById('chkPep') && document.getElementById('chkPep').checked;
    const status = (document.querySelector('input[name="status"]:checked') || {}).value || 'all';

    // simple filtering logic
    let results = DATA.filter(item=>{
      if(type && item.type !== type) return false;
      if(country && item.country !== country) return false;
      if(status && status !== 'all' && item.status !== status) return false;
      if(q && !`${item.name} ${item.id}`.toLowerCase().includes(q.toLowerCase())) return false;
      // demo: if sanctions checked, filter out inactive
      if(sanctions && item.status === 'inactive') return false;
      // demo: if pep checked, include only people
      if(pep && item.type !== 'person') return false;
      return true;
    });

    renderRows(results);
  }

  doSearchBtn.addEventListener('click', performFilter);
  resetBtn.addEventListener('click', ()=>{
    ['q','type','country','chkSanctions','chkPep'].forEach(id=>{
      const el = document.getElementById(id);
      if(!el) return;
      if(el.type === 'checkbox') el.checked = false;
      else el.value = '';
    });
    document.querySelector('input[name="status"][value="all"]').checked = true;
    renderRows(DATA);
  });

  // Delegate action buttons
  tbody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id;
    if(!id) return;
    if(btn.textContent.includes('Открыть')){
      alert('Открыть запись: ' + id + ' (демо)');
    } else if(btn.textContent.includes('Отчёт')){
      alert('Генерация отчёта для ' + id + ' (демо)');
    }
  });
}

// Helper to set current year in footers
function setYear(){
  const y = new Date().getFullYear();
  ['#year','#yearAbout','#yearServices','#yearContact'].forEach(sel=>{
    const el = document.querySelector(sel);
    if(el) el.textContent = y;
  });

  

}

