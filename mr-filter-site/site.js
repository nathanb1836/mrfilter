/* Shared behaviour for every page */
(function () {
  var b = document.getElementById('menu-btn'), n = document.getElementById('mobile-nav');
  if (b && n) b.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
    b.textContent = open ? 'Close' : 'Menu';
  });
})();

/* ZIP codes you serve (5 digits each). Leave empty to answer "we'll confirm when we contact you". */
window.SERVICE_ZIPS = '';

/* Sends a quote request to /api/lead. Resolves true on success, false on any failure. */
window.sendLead = function (payload) {
  return fetch('/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(function (r) { return r.ok; }).catch(function () { return false; });
};
