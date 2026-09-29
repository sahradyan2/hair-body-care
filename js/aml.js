// Improved AML interaction (save as js/aml.js and include before </body>)
// This script assumes css/aml.css is loaded and uses the existing form markup.

(function () {
  const btn = document.getElementById('amlCheckBtn');
  const addressInput = document.getElementById('address');
  const networkSelect = document.getElementById('network');
  const resultEl = document.getElementById('amlResult');

  function setLoading(loading) {
    if (loading) {
      resultEl.classList.add('loading');
      resultEl.innerHTML = '<div class="spinner" aria-hidden="true"></div><div class="meta">Выполняется проверка...</div>';
    } else {
      resultEl.classList.remove('loading');
    }
  }

  function validateAddress(addr) {
    if (!addr) return false;
    // basic length check to avoid obvious empty/short values; replace with real validation if available
    return addr.trim().length >= 8;
  }

  function showResult({ network, address, risk }) {
    const riskClass = risk === 'High' ? 'risk--high' : (risk === 'Medium' ? 'risk--medium' : 'risk--low');
    const badge = `<span class="risk-badge ${riskClass}">${risk.toUpperCase()}</span>`;
    const meta = `<div class="meta"><strong>Сеть:</strong> ${network.toUpperCase()} • <strong>Адрес:</strong> <span style="opacity:.95">${address}</span></div>`;
    resultEl.innerHTML = badge + meta;
  }

  btn.addEventListener('click', function () {
    const address = addressInput.value.trim();
    const network = networkSelect.value;

    if (!validateAddress(address)) {
      resultEl.innerHTML = '<div class="meta" style="color:#ffb4b4">Пожалуйста, введите корректный адрес кошелька.</div>';
      return;
    }

    setLoading(true);

    // Simulate API call — replace this with real fetch() to your AML endpoint.
    setTimeout(() => {
      // Demo logic for risk selection
      const random = Math.random();
      let demoRisk = 'Low';
      if (random < 0.18) demoRisk = 'High';
      else if (random < 0.52) demoRisk = 'Medium';

      setLoading(false);
      showResult({ network, address, risk: demoRisk });
    }, 900);
  });

  // Optional: submit on Enter in the address field
  addressInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btn.click();
    }
  });
})();