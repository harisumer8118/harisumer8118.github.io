// Topbar badge: types out a single line of JS code, letter by letter,
// then clears it and loops — like someone is live-coding.
document.addEventListener('DOMContentLoaded', function () {
  var el = document.getElementById('codeLine');
  if (!el) return;

  var code = 'const status = "open for new projects";';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    el.textContent = code;
    return;
  }

  var TYPE_SPEED = 55;   // ms per character
  var HOLD_TIME = 1400;  // pause once the line is fully typed
  var RESTART_DELAY = 500; // pause on the empty line before retyping

  var i = 0;
  var typing = true;

  function tick() {
    if (typing) {
      if (i <= code.length) {
        el.textContent = code.slice(0, i);
        i++;
        setTimeout(tick, TYPE_SPEED);
      } else {
        typing = false;
        setTimeout(tick, HOLD_TIME);
      }
    } else {
      el.textContent = '';
      i = 0;
      typing = true;
      setTimeout(tick, RESTART_DELAY);
    }
  }

  tick();
});
