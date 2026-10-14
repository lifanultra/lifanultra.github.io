/** Completed days since the configured foundation date; refresh at the next day boundary. */
(function () {
  'use strict';
  var age = document.getElementById('site-age');
  if (!age) return;
  var start = Date.parse(age.getAttribute('data-start'));
  if (!Number.isFinite(start)) return;
  var timer;
  function update() {
    var now = Date.now();
    var days = Math.max(0, Math.floor((now - start) / 86400000));
    age.querySelector('[data-unit="days"]').textContent = days;
    clearTimeout(timer);
    timer = setTimeout(update, Math.min(86400000, Math.max(1, start + (days + 1) * 86400000 - now)));
  }
  update();
  document.addEventListener('visibilitychange', function () { if (!document.hidden) update(); });
  window.addEventListener('pageshow', update);
}());
