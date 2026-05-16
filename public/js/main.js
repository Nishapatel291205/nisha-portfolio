// =============================================
//   NISHA PATEL PORTFOLIO — main.js v3
// =============================================

// ─── CUSTOM CURSOR ───
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});
(function trackRing() {
  rx += (mx - rx) * 0.13;
  ry += (my - ry) * 0.13;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top  = ry + 'px';
  requestAnimationFrame(trackRing);
})();
document.querySelectorAll('a,button,.sk-card,.pcard,.acard,.clink,.ach,.cert-card,.tkc').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('big'); cursorRing.classList.add('big'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('big'); cursorRing.classList.remove('big'); });
});

// ─── PROGRESS BAR ───
const progressBar = document.getElementById('progressBar');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
});

// ─── NAV SCROLL ───
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── ACTIVE NAV LINK ───
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 130) cur = s.id; });
  navAs.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--cyan)' : '';
  });
});

// ─── HAMBURGER MENU ───
const ham     = document.getElementById('hamburger');
const mobileN = document.getElementById('mobileNav');
if (ham && mobileN) {
  ham.addEventListener('click', () => mobileN.classList.toggle('open'));
  mobileN.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileN.classList.remove('open'));
  });
}

// ─── ROLE CYCLING TYPEWRITER ───
const roles = [
  'intelligent web apps',
  'ML-powered APIs',
  'MERN applications',
  'data pipelines',
  'AI-driven features',
  'React interfaces',
  'neural networks'
];
const roleEl = document.getElementById('roleText');
let ri = 0, ci = 0, deleting = false;
function typeRole() {
  const word = roles[ri];
  if (!deleting) {
    if (roleEl) roleEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeRole, 1800); return; }
    setTimeout(typeRole, 70);
  } else {
    if (roleEl) roleEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeRole, 300); return; }
    setTimeout(typeRole, 35);
  }
}
setTimeout(typeRole, 1200);

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal,.tl');
const ro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
  });
}, { threshold: 0.07 });
revealEls.forEach(el => ro.observe(el));

// ─── COUNTER ANIMATION ───
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const dec    = parseInt(el.dataset.dec || '0');
  const suffix = el.dataset.suf || '';
  let val = 0, step = target / 100;
  const t = setInterval(() => {
    val += step;
    if (val >= target) { val = target; clearInterval(t); }
    el.textContent = dec > 0 ? val.toFixed(dec) + suffix : Math.floor(val) + suffix;
  }, 16);
}
const statEls = document.querySelectorAll('.hstat-n');
const statObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); statObs.unobserve(e.target); } });
}, { threshold: 0.5 });
statEls.forEach(el => statObs.observe(el));

// ─── PARALLAX BG GLOW ───
const g1 = document.querySelector('.g1');
const g2 = document.querySelector('.g2');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (g1) g1.style.transform = `translateY(${y * 0.07}px)`;
  if (g2) g2.style.transform = `translateY(${y * -0.04}px)`;
});

// ─── CONTACT FORM (with email via backend) ───
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText   = document.getElementById('btnText');
const btnLoad   = document.getElementById('btnLoad');
const formOk    = document.getElementById('formOk');
const formErr   = document.getElementById('formErr');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Hide old messages
    if (formOk) formOk.style.display = 'none';
    if (formErr) formErr.style.display = 'none';

    // Show loading state
    if (btnText) btnText.style.display = 'none';
    if (btnLoad) btnLoad.style.display = 'inline';
    if (submitBtn) submitBtn.disabled = true;

    const payload = {
      name:    form.querySelector('[name="name"]').value.trim(),
      email:   form.querySelector('[name="email"]').value.trim(),
      subject: form.querySelector('[name="subject"]')?.value.trim() || '',
      message: form.querySelector('[name="message"]').value.trim()
    };

    try {
      const res = await fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(payload)
});

      const data = await res.json();

      if (res.ok && data.success) {
        if (formOk) { formOk.style.display = 'block'; }
        form.reset();
        // Auto-hide after 6s
        setTimeout(() => { if (formOk) formOk.style.display = 'none'; }, 6000);
      } else {
        if (formErr) {
          formErr.textContent = '❌ ' + (data.error || 'Something went wrong. Please email me directly.');
          formErr.style.display = 'block';
        }
      }
    } catch (err) {
      // Backend not running — show fallback
      if (formErr) {
        formErr.textContent = '⚠️ Server offline. Please email: nishapatel291205@gmail.com';
        formErr.style.display = 'block';
      }
    }

    if (btnText) btnText.style.display = 'inline';
    if (btnLoad) btnLoad.style.display = 'none';
    if (submitBtn) submitBtn.disabled = false;
  });
}

// ─── DEV CONSOLE ───
console.log(`%c NP · nishapatel291205@gmail.com · MERN + AI/ML`,
  'color:#06b6d4;font-family:monospace;font-size:12px;font-weight:bold;');
