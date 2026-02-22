/* ============================================================
   Pusula Holding – main.js
============================================================ */

// ─── Sticky Header ───────────────────────────────────────────
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });


// ─── Mobile Menu ─────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mainNav   = document.getElementById('main-nav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mainNav.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

// Close menu when a link is clicked
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mainNav.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Mobile: toggle dropdowns on tap
if (window.innerWidth <= 768) {
  document.querySelectorAll('.nav-item.has-dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const item = link.closest('.nav-item');
      item.classList.toggle('open');
    });
  });
}


// ─── Hero Slider ─────────────────────────────────────────────
(function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  const prev   = document.getElementById('hero-prev');
  const next   = document.getElementById('hero-next');

  let current  = 0;
  let autoplay = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAutoplay() {
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplay);
    startAutoplay();
  }

  prev.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  next.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.index, 10));
      resetAutoplay();
    });
  });

  // Swipe support
  let touchStartX = 0;
  const heroEl = document.querySelector('.hero');

  heroEl.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  heroEl.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAutoplay(); }
  });

  startAutoplay();
})();


// ─── Counter Animation ────────────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      el.textContent = target.toLocaleString('tr-TR');
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current).toLocaleString('tr-TR');
    }
  }, step);
}

// Trigger counters when stats band enters viewport
const statNumbers = document.querySelectorAll('.stat-number[data-target]');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(animateCounter);
    }
  });
}, { threshold: 0.4 });

const statsBand = document.querySelector('.stats-band');
if (statsBand) statsObserver.observe(statsBand);


// ─── Fade-in on Scroll ────────────────────────────────────────
const fadeEls = document.querySelectorAll(
  '.sector-card, .company-card, .news-card, .about-value-card, .investor-link-item, .investor-badge, .contact-item'
);

fadeEls.forEach(el => el.classList.add('fade-in'));

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObserver.observe(el));


// ─── Contact Form ─────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Gönderiliyor...';
    btn.disabled = true;

    // Simulate sending (replace with actual fetch/API call)
    setTimeout(() => {
      btn.textContent = 'Mesajınız Alındı ✓';
      btn.style.background = '#12B76A';
      btn.style.borderColor = '#12B76A';
      contactForm.reset();

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.disabled = false;
      }, 3000);
    }, 1000);
  });
}


// ─── Smooth scroll for anchor links ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});
