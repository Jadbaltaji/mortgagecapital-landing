// ===== Mortgage Capital LLC — site scripts =====

// Mobile nav
document.addEventListener('click', function (e) {
  var t = e.target.closest('.nav-toggle');
  if (t) document.querySelector('.nav').classList.toggle('open');
});

// ---- Quote form ----
// CONFIG: paste your CRM / webhook endpoint here (Zapier, Make, GoHighLevel, Arive intake, etc.).
// Leave blank to test locally — submissions will log to the console and show the success state.
var LEAD_WEBHOOK_URL = '';

// Keep this version string in sync with the consent text in quote.html.
// It is stored with every lead so you can prove exactly what the consumer agreed to.
var CONSENT_VERSION = '2026-09-28-v2';

var form = document.getElementById('quote-form');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    function check(id, test, msg) {
      var field = document.getElementById(id).closest('.field');
      if (!test) { field.classList.add('error'); field.querySelector('.err').textContent = msg; ok = false; }
      else field.classList.remove('error');
    }
    var name = form.full_name.value.trim();
    var phone = form.phone.value.replace(/\D/g, '');
    var email = form.email.value.trim();
    check('full_name', name.length >= 2, 'Enter your full name.');
    check('phone', phone.length === 10 || phone.length === 11, 'Enter a 10-digit phone number.');
    check('email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), 'Enter a valid email address.');

    var consentBox = form.consent;
    var consentWrap = consentBox.closest('.consent');
    var consentErr = document.getElementById('consent-err');
    if (!consentBox.checked) { consentWrap.classList.add('error'); consentErr.classList.add('show'); ok = false; }
    else { consentWrap.classList.remove('error'); consentErr.classList.remove('show'); }

    if (!ok) return;

    var payload = {
      full_name: name,
      phone: phone,
      email: email,
      loan_purpose: form.loan_purpose.value,
      // ---- proof-of-consent record (keep these fields in your CRM) ----
      consent_given: true,
      consent_text: document.getElementById('consent-text').innerText.replace(/\s+/g, ' ').trim(),
      consent_version: CONSENT_VERSION,
      consent_timestamp: new Date().toISOString(),
      consent_page_url: window.location.href,
      consent_user_agent: navigator.userAgent,
      source: 'website-quote-form'
    };

    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Sending…';

    var done = function () {
      document.getElementById('form-body').hidden = true;
      document.getElementById('form-success').hidden = false;
      window.scrollTo({ top: 0 });
    };

    if (!LEAD_WEBHOOK_URL) { console.log('Lead (no webhook configured):', payload); setTimeout(done, 500); return; }

    fetch(LEAD_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(done)
      .catch(function () {
        btn.disabled = false; btn.textContent = 'Get My Free Quote →';
        alert('Something went wrong sending your request. Please call us at (248) 242-7209 or support at (313) 394-7617.');
      });
  });
}
