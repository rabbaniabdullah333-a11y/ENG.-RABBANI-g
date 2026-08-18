/* ─── Mobile Check ────────────────────────────────────────────────────────────── */
const isMobile = () => window.innerWidth <= 768;

/* ─── Loader ──────────────────────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.querySelector('.loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 700);
  }, 1200);
});

/* ─── Custom Cursor ───────────────────────────────────────────────────────────── */
const cursorDot = document.querySelector('.cursor');
const cursorRing = document.querySelector('.cursor-ring');

if (!isMobile() && cursorDot && cursorRing) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  });
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();
  document.querySelectorAll('a, button, .glass-card, .main-service-card, .btn, .feature-item').forEach(el => {
    el.addEventListener('mouseenter', () => { cursorDot.classList.add('expand'); cursorRing.classList.add('expand'); });
    el.addEventListener('mouseleave', () => { cursorDot.classList.remove('expand'); cursorRing.classList.remove('expand'); });
  });
} else {
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorRing) cursorRing.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ─── Scroll Progress ─────────────────────────────────────────────────────────── */
const progressBar = document.querySelector('.scroll-progress');
const backTopBtn = document.querySelector('.back-top');
const navEl = document.querySelector('.nav');

window.addEventListener('scroll', () => {
  const scrolled = document.documentElement.scrollTop;
  const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
  if (backTopBtn) scrolled > 500 ? backTopBtn.classList.add('show') : backTopBtn.classList.remove('show');
  if (navEl) scrolled > 60 ? navEl.classList.add('scrolled') : navEl.classList.remove('scrolled');
});

if (backTopBtn) backTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── Mobile Nav ──────────────────────────────────────────────────────────────── */
const hamburgers = document.querySelectorAll('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Create overlay element for mobile nav backdrop
let navOverlay = document.getElementById('navOverlay');
if (!navOverlay) {
  navOverlay = document.createElement('div');
  navOverlay.id = 'navOverlay';
  navOverlay.className = 'nav-overlay';
  document.body.appendChild(navOverlay);
}

function openNav() {
  if (navLinks) navLinks.classList.add('open');
  hamburgers.forEach(h => {
    h.innerHTML = '<i class="fas fa-times"></i>';
    h.setAttribute('aria-expanded', 'true');
  });
  document.body.style.overflow = 'hidden';
  if (navOverlay) navOverlay.classList.add('show');
}

function closeNav() {
  if (navLinks) navLinks.classList.remove('open');
  hamburgers.forEach(h => {
    h.innerHTML = '<i class="fas fa-bars"></i>';
    h.setAttribute('aria-expanded', 'false');
  });
  document.body.style.overflow = '';
  if (navOverlay) navOverlay.classList.remove('show');
}

if (hamburgers.length > 0 && navLinks) {
  hamburgers.forEach(h => {
    h.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.contains('open') ? closeNav() : openNav();
    });
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));
  navOverlay.addEventListener('click', closeNav);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('open')) {
    closeNav();
  }
});


/* ─── Scroll Reveal ───────────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

/* ─── Counter Animation ───────────────────────────────────────────────────────── */
function animateCounter(el, target, suffix = '', duration = 1800) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const counterEls = document.querySelectorAll('[data-count]');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      animateCounter(el, target, suffix);
      cio.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => cio.observe(el));

/* ─── Active Nav Highlight ────────────────────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current || a.getAttribute('href') === './#' + current) {
      a.classList.add('active');
    }
  });
});

/* ─── Contact Form ────────────────────────────────────────────────────────────── */
const contactForm = document.getElementById('mainContactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #25D366, #1ebe57)';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 3500);
  });
}

/* ─── Compact Action Bar: CV Modal & More Menu Handlers ─────────────────────── */
const cvModalBackdrop = document.getElementById('cvModalBackdrop');
const cvModalCloseBtn = document.getElementById('cvModalCloseBtn');
const printCvBtn = document.getElementById('printCvBtn');
const modalDownloadCvBtn = document.getElementById('modalDownloadCvBtn');

function openCvModal() {
  if (cvModalBackdrop) {
    cvModalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeMoreMenu();
  }
}

function closeCvModal() {
  if (cvModalBackdrop) {
    cvModalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Attach CV open listeners to all View CV buttons
document.querySelectorAll('.act-viewcv, #actionBarViewCv, #headerViewCvBtn, #heroViewCvBtn, #bnavViewCv').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openCvModal();
  });
});

if (cvModalCloseBtn) cvModalCloseBtn.addEventListener('click', closeCvModal);
if (cvModalBackdrop) {
  cvModalBackdrop.addEventListener('click', e => {
    if (e.target === cvModalBackdrop) closeCvModal();
  });
}

if (printCvBtn) {
  printCvBtn.addEventListener('click', () => {
    window.print();
  });
}

// CV Download Functionality
function downloadResume() {
  const resumeContent = `=====================================================
HAFIZ ABDULLAH RABBANI - CURRICULUM VITAE
Full-Stack Web Developer & Digital Growth Specialist
Islamabad, Pakistan | Phone: +92 347 7128889
Email: rabbaniabdullah333@gmail.com
Portfolio: https://rabbani.dev/
=====================================================

PROFESSIONAL SUMMARY
Dynamic and results-driven specialist with 5+ years of cross-functional experience across Full-Stack Web Development, Data-Driven Performance Marketing (SEO, Google Ads, Meta Ads), Marketplace Store Operations (Amazon FBA, eBay, Shopify), and Graphic Branding. Proven record of delivering 250+ projects globally with 99% client satisfaction.

CORE COMPETENCIES
- Web Development: HTML5, CSS3, Vanilla JavaScript, React.js, Node.js, Express, PHP, MySQL, MongoDB, REST APIs.
- Digital Marketing & Ads: Meta Ads, Google Ads, SEO (Technical/On-Page), CRO, GA4 Analytics.
- E-Commerce: Amazon FBA/PPC, Helium 10, eBay Cassini SEO, Shopify Store Development.
- Creative Design: Adobe Photoshop, Illustrator, Figma UI Prototyping, Ad Creatives.

EXPERIENCE
- Senior Full-Stack Developer & Growth Consultant (2023 - Present)
  Global Remote Contracts & Freelance Consulting
- Digital Marketing & E-Commerce Account Specialist (2021 - 2023)
  E-Commerce Agency Solutions
- Frontend Web Developer & Brand Designer (2019 - 2021)
  Digital Agency

CERTIFICATIONS
- Google Ads & Google Analytics 4 Certified — Google Digital Academy
- Meta Certified Digital Marketing Associate — Meta Blueprint
- Full-Stack Web Engineering Certification — Professional Institute
- Hafiz-ul-Quran Certified — Islamic Studies

Direct WhatsApp: +92 347 7128889
=====================================================`;

  const blob = new Blob([resumeContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Hafiz_Abdullah_Rabbani_CV.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

document.querySelectorAll('.act-download, #actionBarDownloadCv, #modalDownloadCvBtn, #bnavDownloadCv').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    downloadResume();
  });
});

/* ─── More Menu Drawer ──────────────────────────────────────────────────────── */
const moreMenuOverlay = document.getElementById('moreMenuOverlay');
const moreMenuDrawer = document.getElementById('moreMenuDrawer');
const moreMenuClose = document.getElementById('moreMenuClose');

function openMoreMenu() {
  if (moreMenuDrawer && moreMenuOverlay) {
    moreMenuDrawer.classList.add('open');
    moreMenuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeMoreMenu() {
  if (moreMenuDrawer && moreMenuOverlay) {
    moreMenuDrawer.classList.remove('open');
    moreMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.querySelectorAll('.act-more, #actionBarMore').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    openMoreMenu();
  });
});

if (moreMenuClose) moreMenuClose.addEventListener('click', closeMoreMenu);
if (moreMenuOverlay) moreMenuOverlay.addEventListener('click', closeMoreMenu);

document.querySelectorAll('.more-nav-item').forEach(link => {
  link.addEventListener('click', () => {
    closeMoreMenu();
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCvModal();
    closeMoreMenu();
  }
});

/* ─── Particles.js ────────────────────────────────────────────────────────────── */
if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
  particlesJS('particles-js', {
    particles: {
      number: { value: isMobile() ? 25 : 55, density: { enable: true, value_area: 900 } },
      color: { value: ['#D4AF37', '#b8860b', '#f5e6a3'] },
      shape: { type: 'circle' },
      opacity: { value: 0.35, random: true, anim: { enable: true, speed: .8, opacity_min: .05, sync: false } },
      size: { value: 2, random: true, anim: { enable: true, speed: 1.5, size_min: .3, sync: false } },
      line_linked: { enable: true, distance: 130, color: '#D4AF37', opacity: 0.12, width: 1 },
      move: { enable: true, speed: 1.2, direction: 'none', random: true, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: !isMobile(), mode: 'grab' },
        onclick: { enable: true, mode: 'push' },
        resize: true
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: .45 } },
        push: { particles_nb: 3 }
      }
    },
    retina_detect: true
  });
}

/* ─── Cinematic Agency Canvas Visualizer ──────────────────────────────────────── */
(function initCinematicCanvas() {
  const canvas = document.getElementById('cinematicCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? '#D4AF37' : '#6366f1';
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle repel
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
      this.draw();
    }
  }

  const particleCount = isMobile() ? 30 : 65;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function connect() {
    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        let dx = particles[a].x - particles[b].x;
        let dy = particles[a].y - particles[b].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          let opacity = (1 - dist / 120) * 0.25;
          ctx.strokeStyle = `rgba(212, 175, 55, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => p.update());
    connect();
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── 3D Card Tilt & Micro-Glow Effects ──────────────────────────────────────── */
if (!isMobile()) {
  document.querySelectorAll('.agency-service-card, .case-study-card, .why-card, .main-service-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateX = ((y - cy) / cy) * -6;
      const rotateY = ((x - cx) / cx) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── Stylish Animated Text Rotator ──────────────────────────────────────────── */
(function initTextRotators() {
  const rotators = document.querySelectorAll('.dynamic-rotating-text');
  rotators.forEach(rotator => {
    const words = JSON.parse(rotator.getAttribute('data-words') || '[]');
    if (words.length <= 1) return;

    let index = 0;
    setInterval(() => {
      rotator.style.opacity = '0';
      rotator.style.transform = 'translateY(-10px) scale(0.96)';
      
      setTimeout(() => {
        index = (index + 1) % words.length;
        rotator.textContent = words[index];
        rotator.style.opacity = '1';
        rotator.style.transform = 'translateY(0) scale(1)';
      }, 350);
    }, 3200);
  });
})();



