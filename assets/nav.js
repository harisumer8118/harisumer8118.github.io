// Mobile navigation toggle (hamburger dropdown)
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('primaryNav');
  if (!toggle || !menu) return;

  function closeMenu() {
    menu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }
  function openMenu() {
    menu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', function () {
    var isOpen = menu.classList.contains('open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', function (e) {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(e.target) || toggle.contains(e.target)) return;
    closeMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 900) closeMenu();
  });
});

// Projects showcase — reveal any additional (.is-extra) project cards
document.addEventListener('DOMContentLoaded', function () {
  var grid = document.getElementById('projectsGrid');
  var btn = document.getElementById('viewAllProjectsBtn');
  if (!grid || !btn) return;

  var extraCount = grid.querySelectorAll('.work-card.is-extra').length;
  if (extraCount === 0) {
    btn.style.display = 'none';
    return;
  }

  btn.addEventListener('click', function () {
    grid.classList.add('show-all');
    btn.style.display = 'none';
  });
});

// ---------------------------------------------------------------
// EmailJS contact form handling
// Same EmailJS account/service/templates as harisumer8118.github.io
// ---------------------------------------------------------------
var EMAILJS_PUBLIC_KEY = 'a4vuHJxq4VkksaQJo';
var EMAILJS_SERVICE_ID = 'service_cr4v0pp';
var EMAILJS_ADMIN_TEMPLATE_ID = 'template_bepsdzk';
var EMAILJS_AUTOREPLY_TEMPLATE_ID = 'template_xhvqhl4';

function sendContactForm(form, opts) {
  opts = opts || {};

  var submitBtn = form.querySelector('button[type="submit"]');
  var status = form.querySelector('.form-status');
  var originalBtnText = submitBtn ? submitBtn.innerHTML : '';

  var nameField = form.querySelector('[data-field="name"]');
  var emailField = form.querySelector('[data-field="email"]');
  var phoneField = form.querySelector('[data-field="phone"]');
  var messageField = form.querySelector('[data-field="message"]');

  var name = nameField ? nameField.value : '';
  var email = emailField ? emailField.value : '';
  var phone = phoneField ? phoneField.value : '';
  var message = messageField ? messageField.value : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending…';
  }
  if (status) {
    status.style.color = '#8a8f97';
    status.textContent = 'Sending your message…';
  }

  function finish(success, errorMessage) {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
    if (status) {
      status.style.color = success ? '#7cc0a0' : '#e18a8a';
      status.textContent = success
        ? ''
        : (errorMessage || 'Something went wrong. Please try again or email directly.');
    }
    if (success) {
      form.reset();
      if (typeof window.openSuccessPopup === 'function') window.openSuccessPopup();
      if (typeof opts.onSuccess === 'function') opts.onSuccess();
    }
  }

  if (typeof emailjs === 'undefined') {
    // EmailJS SDK failed to load — fail gracefully instead of hanging
    finish(false, 'Could not connect to the mail service. Please email directly.');
    return;
  }

  emailjs.init(EMAILJS_PUBLIC_KEY);

  var time = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  var adminParams = {
    name: name,
    email: email,
    phone: phone,
    message: message,
    time: time,
    title: 'New Contact Form Submission'
  };

  var autoReplyParams = {
    from_name: 'Haris Umer',
    email: email,
    to_name: name,
    reply_to: 'contact@harisumer.me',
    message: message,
    name: name,
    phone: phone,
    time: time
  };

  // Send admin notification, then the auto-reply — same two-step flow as the GitHub site
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ADMIN_TEMPLATE_ID, adminParams)
    .then(function () {
      return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, autoReplyParams);
    })
    .then(function () {
      finish(true);
    })
    .catch(function (err) {
      console.error('EmailJS error:', err);
      finish(false);
    });
}

document.addEventListener('DOMContentLoaded', function () {
  var forms = document.querySelectorAll('#contactForm, #talkPopupForm');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      sendContactForm(form, {
        onSuccess: function () {
          // If this was the popup form, slide it closed after a short pause
          if (form.id === 'talkPopupForm' && typeof window.closeTalkPopup === 'function') {
            setTimeout(window.closeTalkPopup, 1100);
          }
        }
      });
    });
  });
});

// ---------------------------------------------------------------
// "Let's Talk" popup — slides in from the left, no slider/carousel
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var popup = document.getElementById('talkPopup');
  var overlay = document.getElementById('talkPopupOverlay');
  var closeBtn = document.getElementById('talkPopupClose');
  if (!popup || !overlay) return;

  function openTalkPopup(e) {
    if (e) e.preventDefault();
    popup.classList.add('active');
    overlay.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('talk-popup-open');
  }

  function closeTalkPopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('talk-popup-open');
  }
  window.closeTalkPopup = closeTalkPopup;

  // Every "Let's Talk" nav button opens the popup instead of navigating away
  document.querySelectorAll('.nav-cta').forEach(function (btn) {
    btn.addEventListener('click', openTalkPopup);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeTalkPopup);
  overlay.addEventListener('click', closeTalkPopup);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) closeTalkPopup();
  });
});

// ---------------------------------------------------------------
// Success popup — shown after a contact form submits successfully
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var popup = document.getElementById('successPopup');
  var overlay = document.getElementById('successPopupOverlay');
  var closeBtn = document.getElementById('successPopupClose');
  if (!popup || !overlay) return;

  var autoCloseTimer = null;

  function openSuccessPopup() {
    popup.classList.add('active');
    overlay.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    document.body.classList.add('success-popup-open');

    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(closeSuccessPopup, 5000);
  }

  function closeSuccessPopup() {
    popup.classList.remove('active');
    overlay.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('success-popup-open');
    if (autoCloseTimer) { clearTimeout(autoCloseTimer); autoCloseTimer = null; }
  }

  window.openSuccessPopup = openSuccessPopup;
  window.closeSuccessPopup = closeSuccessPopup;

  if (closeBtn) closeBtn.addEventListener('click', closeSuccessPopup);
  overlay.addEventListener('click', closeSuccessPopup);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('active')) closeSuccessPopup();
  });
});
