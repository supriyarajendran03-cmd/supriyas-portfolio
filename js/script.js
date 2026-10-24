(function () {
  'use strict';
  var root = document.documentElement;

  /* 1. Mobile menu */
  var menuBtn = document.getElementById('menu-toggle');
  var nav = document.getElementById('site-nav');
  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.classList.toggle('is-open', open);
  }
  menuBtn.addEventListener('click', function () {
    setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
  });

  /* 2. Light / dark theme */
  var themeBtn = document.getElementById('theme-toggle');
  var themeIcon = document.getElementById('theme-icon');
  function applyTheme(theme) {
    var dark = theme === 'dark';
    if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    themeIcon.innerHTML = dark ? '&#9728;' : '&#9790;';
  }
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* 3. Welcome message based on visitor choice */
  var messages = {
    recruiter: "Welcome! I'm looking for an internship or entry-level role. My projects below show what I can build today.",
    teacher: 'Hello! This site is my semester portfolio. Every project was written by me, and the source is on GitHub.',
    friend: "Hey! Thanks for dropping by. Scroll down to see what I've been building lately."
  };
  var welcome = document.getElementById('welcome-message');
  var visitorChips = document.querySelectorAll('[data-visitor]');
  function setVisitor(key) {
    welcome.textContent = messages[key];
    visitorChips.forEach(function (c) {
      var on = c.dataset.visitor === key;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-pressed', String(on));
    });
  }
  visitorChips.forEach(function (c) { c.addEventListener('click', function () { setVisitor(c.dataset.visitor); }); });
  setVisitor('recruiter');

  /* 4. Project filter */
  var filterBtns = document.querySelectorAll('[data-filter]');
  var projects = document.querySelectorAll('.project');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filterBtns.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', String(on));
      });
      projects.forEach(function (p) { p.hidden = !(f === 'all' || p.dataset.category === f); });
    });
  });

  /* 5. Expand / collapse project details */
  document.querySelectorAll('.more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var panel = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.textContent = open ? 'Show details' : 'Hide details';
      panel.hidden = open;
    });
  });

  /* 6. Contact form validation (does not send anything) */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  function showError(input, msg) {
    document.getElementById(input.id + '-error').textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function validate(input) {
    var v = input.value.trim();
    if (!v) return showError(input, 'Please enter your ' + input.name + '.');
    if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return showError(input, 'Enter a valid email, like name@example.com.');
    if (input.name === 'message' && v.length < 10) return showError(input, 'Write at least 10 characters.');
    return showError(input, '');
  }
  var fields = form.querySelectorAll('input, textarea');
  fields.forEach(function (f) { f.addEventListener('blur', function () { validate(f); }); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    var firstBad = null;
    fields.forEach(function (f) { if (!validate(f) && !firstBad) firstBad = f; });
    if (firstBad) { firstBad.focus(); return; }
    status.textContent = 'Thanks! Your details look good. This demo form does not send messages, so please use the email link.';
    form.reset();
  });

  /* 7. Back-to-top button */
  var toTop = document.getElementById('to-top');
  window.addEventListener('scroll', function () { toTop.hidden = window.scrollY < 500; }, { passive: true });
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  /* 8. Highlight current nav link while scrolling */
  var links = document.querySelectorAll('.site-nav a');
  var sections = Array.prototype.map.call(links, function (a) { return document.querySelector(a.getAttribute('href')); });
  function updateActive() {
    var y = window.scrollY + 120, current = 0;
    sections.forEach(function (s, i) { if (s && s.offsetTop <= y) current = i; });
    links.forEach(function (a, i) { if (i === current) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* Footer year */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
