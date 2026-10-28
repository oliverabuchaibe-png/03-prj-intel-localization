(function () {
  var html = document.documentElement;
  var bootstrapLink = document.getElementById('bootstrap-css');
  var toggle = document.getElementById('dir-toggle');
  var label = document.getElementById('dir-toggle-label');
  var BOOTSTRAP_LTR = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
  var BOOTSTRAP_RTL = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css';
  var RTL_LANGS = ['ar', 'he', 'iw', 'fa', 'ur', 'yi', 'ps', 'sd', 'ug', 'dv', 'ckb'];
  var manual = false;

  function setDirection(dir) {
    if (html.getAttribute('dir') === dir) return;
    html.setAttribute('dir', dir);
    bootstrapLink.setAttribute('href', dir === 'rtl' ? BOOTSTRAP_RTL : BOOTSTRAP_LTR);
    var rtl = dir === 'rtl';
    toggle.setAttribute('aria-pressed', String(rtl));
    label.textContent = rtl ? 'Switch to left-to-right layout' : 'Switch to right-to-left layout';
  }

  // LevelUp: detect language changes (e.g. Google Translate) and apply RTL when needed
  function checkLanguage() {
    if (manual) return;
    var lang = (html.getAttribute('lang') || 'en').toLowerCase().split('-')[0];
    var cls = html.classList;
    if (cls.contains('translated-rtl') || RTL_LANGS.indexOf(lang) !== -1) {
      setDirection('rtl');
    } else {
      setDirection('ltr');
    }
  }

  var observer = new MutationObserver(checkLanguage);
  observer.observe(html, { attributes: true, attributeFilter: ['lang', 'class'] });

  // Manual toggle
  toggle.addEventListener('click', function () {
    manual = true;
    setDirection(html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl');
  });

  if (window.location.hash === '#rtl') {
    manual = true;
    setDirection('rtl');
  } else {
    checkLanguage();
  }

  // Newsletter form
  var form = document.getElementById('newsletter-form');
  var status = document.getElementById('form-status');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fields = form.querySelectorAll('input, select');
    fields.forEach(function (f) {
      f.setAttribute('aria-invalid', f.checkValidity() ? 'false' : 'true');
    });
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      var first = form.querySelector(':invalid');
      if (first) first.focus();
      status.className = 'mt-3 text-danger fw-semibold';
      status.textContent = 'Please fix the highlighted fields and try again.';
      return;
    }
    status.className = 'mt-3 text-success fw-semibold';
    status.textContent = 'Thanks for subscribing, ' + form.elements['first-name'].value + '! Check your inbox to confirm.';
    form.reset();
    form.classList.remove('was-validated');
  });
})();
