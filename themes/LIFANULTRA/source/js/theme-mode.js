/** Black/white mode uses the visitor's local time: 06:00 <= day < 18:00. */
(function () {
  'use strict';
  var storageKey = 'lifanultra-theme-mode';
  try {
    var previous = localStorage.getItem('cactus-theme-mode');
    if (!localStorage.getItem(storageKey) && previous) localStorage.setItem(storageKey, previous);
    localStorage.removeItem('cactus-theme-mode');
  } catch (error) { /* Preserve switching when storage is blocked. */ }
  var darkSheet = document.getElementById('theme-dark');
  var lightSheet = document.getElementById('theme-light');
  var button;
  var timer;
  var selected;
  var currentPeriod;

  function timeSlot(now) {
    var hour = now.getHours();
    var day = hour >= 6 && hour < 18;
    var start = new Date(now.getTime());
    if (hour < 6) start.setDate(start.getDate() - 1);
    var date = start.getFullYear() + '-' + (start.getMonth() + 1) + '-' + start.getDate();
    return { period: date + (day ? '-day' : '-night'), mode: day ? 'light' : 'dark' };
  }

  function savedMode(period) {
    try {
      var saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && saved.period === period && (saved.mode === 'light' || saved.mode === 'dark')) {
        return saved.mode;
      }
    } catch (error) { /* Storage can be unavailable; switching still works. */ }
    return null;
  }

  function apply(mode) {
    selected = mode;
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.style.colorScheme = mode;
    // Activate the destination first: the page never has both sheets inactive.
    var targetSheet = mode === 'dark' ? darkSheet : lightSheet;
    var oldSheet = mode === 'dark' ? lightSheet : darkSheet;
    targetSheet.media = 'all';
    oldSheet.media = 'not all';
    if (button) {
      var label = mode === 'dark' ? '切换为白天模式' : '切换为黑夜模式';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(mode === 'dark'));
      button.hidden = false;
    }
  }

  function synchronize() {
    var now = new Date();
    var slot = timeSlot(now);
    // Keep an in-memory selection if browser storage is blocked.
    var mode = savedMode(slot.period) || (currentPeriod === slot.period && selected) || slot.mode;
    currentPeriod = slot.period;
    apply(mode);
    clearTimeout(timer);
    var next = new Date(now.getTime());
    if (now.getHours() < 6) next.setHours(6, 0, 0, 0);
    else if (now.getHours() < 18) next.setHours(18, 0, 0, 0);
    else { next.setDate(next.getDate() + 1); next.setHours(6, 0, 0, 0); }
    timer = setTimeout(synchronize, Math.max(1, next.getTime() - now.getTime()));
  }

  synchronize();
  document.addEventListener('DOMContentLoaded', function () {
    button = document.getElementById('theme-toggle');
    if (!button) return;
    synchronize();
    button.addEventListener('click', function () {
      synchronize();
      apply(selected === 'dark' ? 'light' : 'dark');
      try { localStorage.setItem(storageKey, JSON.stringify({ period: currentPeriod, mode: selected })); }
      catch (error) { /* A blocked store must not prevent the button from working. */ }
    });
  });
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) synchronize();
  });
  window.addEventListener('pageshow', synchronize);
  window.addEventListener('storage', function (event) {
    if (event.key === storageKey || event.key === null) {
      currentPeriod = null;
      synchronize();
    }
  });
}());
