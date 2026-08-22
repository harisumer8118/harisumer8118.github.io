// Dark mode / light mode toggle
// The initial theme is already applied by the inline no-flash script in <head>.
// This file only wires up the visible toggle control and persists changes.
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.getElementById('themeToggle');
  var root = document.documentElement;
  if (!toggle) return;

  function syncButton(theme) {
    toggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  }

  // Reflect whatever theme is already active (set by the inline head script).
  syncButton(root.getAttribute('data-theme') || 'light');

  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    syncButton(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // Keep every open tab in sync if the theme changes elsewhere.
  window.addEventListener('storage', function (e) {
    if (e.key === 'theme' && (e.newValue === 'dark' || e.newValue === 'light')) {
      root.setAttribute('data-theme', e.newValue);
      syncButton(e.newValue);
    }
  });
});
