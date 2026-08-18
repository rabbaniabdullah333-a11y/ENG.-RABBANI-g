// ─── Mobile Detection ──────────────────────────────────────────────────────────
const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    window.innerWidth <= 768;

// ─── Page Loader ───────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
        setTimeout(() => { loader.style.display = 'none'; }, 600);
    }, 1800);
});

// ─── Custom Cursor (Desktop only) ──────────────────────────────────────────────
const cursor   = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (!isMobile() && cursor && follower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top  = e.clientY + 'px';
        setTimeout(() => {
            follower.style.left = e.clientX + 'px';
            follower.style.top  = e.clientY + 'px';
        }, 80);
    });

    document.querySelectorAll('a, button, .glass-card, .btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.style.width  = '50px';
            follower.style.height = '50px';
            follower.style.borderColor = 'var(--accent-color)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.style.width  = '30px';
            follower.style.height = '30px';
            follower.style.borderColor = 'rgba(0, 240, 255, 0.5)';
        });
    });
} else {
    // Hide custom cursor elements on mobile so they don't interfere
    if (cursor)   cursor.style.display   = 'none';
    if (follower) follower.style.display = 'none';
    document.body.style.cursor = 'auto';
}

// ─── Typing Animation ──────────────────────────────────────────────────────────
const texts = [
    "Hafiz-ul-Quran",
    "Future Software Engineer",
    "AI Technology Learner",
    "Creative Web Developer",
    "Digital Entrepreneur",
    "Modern Tech Student"
];
let count = 0, index = 0, currentText = "", letter = "";
const typingElement = document.querySelector('.typing-text');

function type() {
    if (count === texts.length) count = 0;
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    if (typingElement) typingElement.textContent = letter;
    if (letter.length === currentText.length) {
        setTimeout(() => { index = 0; count++; type(); }, 2200);
    } else {
        setTimeout(type, 100);
    }
}
if (typingElement) setTimeout(type, 2000);

// ─── Scroll Progress Bar ──────────────────────────────────────────────────────
const scrollProgressBar = document.querySelector('.scroll-progress');
const backToTopBtn      = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    const scrollPx    = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (scrollProgressBar) scrollProgressBar.style.width = `${(scrollPx / winHeightPx) * 100}%`;
    if (backToTopBtn) {
        scrollPx > 500 ? backToTopBtn.classList.add('show') : backToTopBtn.classList.remove('show');
    }
});

if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Mobile Navigation ────────────────────────────────────────────────────────
const hamburger    = document.querySelector('.hamburger');
const navLinks     = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links li a');

function toggleMobileMenu() {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
        document.body.style.overflow = 'hidden';
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
        document.body.style.overflow = 'auto';
    }
}

function closeMobileMenu() {
    navLinks.classList.remove('active');
    const icon = hamburger?.querySelector('i');
    if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
    document.body.style.overflow = 'auto';
}

if (hamburger) {
    hamburger.addEventListener('click', (e) => { e.stopPropagation(); toggleMobileMenu(); });
    hamburger.addEventListener('touchend', (e) => { e.preventDefault(); toggleMobileMenu(); });
}

navLinkItems.forEach(item => {
    item.addEventListener('click',    closeMobileMenu);
    item.addEventListener('touchend', closeMobileMenu);
});

document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('active') &&
        !navLinks.contains(e.target) &&
        e.target !== hamburger &&
        !hamburger?.contains(e.target)) {
        closeMobileMenu();
    }
});

// ─── Active nav link on scroll ────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            navLinkItems.forEach(a => a.classList.remove('active'));
            const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
            if (active) active.classList.add('active');
        }
    });
});

// ─── Scroll Reveal Animation ──────────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
function runReveal() {
    const windowHeight  = window.innerHeight;
    const elementVisible = 120;
    reveals.forEach(el => {
        if (el.getBoundingClientRect().top < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
}
window.addEventListener('scroll', runReveal);
runReveal();

// ─── Progress Bar Animation (IntersectionObserver) ───────────────────────────
const progressBars = document.querySelectorAll('.progress');
if (progressBars.length) {
    const progressObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar   = entry.target;
                const width = bar.getAttribute('data-width') || '0%';
                requestAnimationFrame(() => { bar.style.width = width; });
                bar.classList.add('animated');
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.25 });
    progressBars.forEach(bar => progressObserver.observe(bar));
}

// ─── Contact Form (optional send handling) ────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.submit-btn-new');
        btn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent!';
        btn.style.background = 'linear-gradient(45deg, #25D366, #00f0ff)';
        setTimeout(() => {
            btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
            btn.style.background = '';
            contactForm.reset();
        }, 3000);
    });
}

// ─── Window Resize Handler ────────────────────────────────────────────────────
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && navLinks) closeMobileMenu();
    }, 250);
});

// ─── Prevent double-tap zoom on mobile ───────────────────────────────────────
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
}, false);

// ─── Mobile touch target sizing ──────────────────────────────────────────────
if (isMobile()) {
    document.querySelectorAll('a, button, .btn').forEach(btn => {
        if (btn.offsetHeight < 44) {
            btn.style.minHeight = '44px';
            btn.style.display   = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
        }
    });
}

// ─── Particles.js ─────────────────────────────────────────────────────────────
if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
        particles: {
            number: { value: isMobile() ? 40 : 80, density: { enable: true, value_area: 800 } },
            color: { value: ["#00f0ff", "#7000ff", "#ffffff"] },
            shape: {
                type: "circle",
                stroke: { width: 0, color: "#000000" },
                polygon: { nb_sides: 5 }
            },
            opacity: {
                value: 0.5, random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3, random: true,
                anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
            },
            line_linked: {
                enable: true, distance: 150,
                color: "#00f0ff", opacity: 0.2, width: 1
            },
            move: {
                enable: true, speed: 2, direction: "none",
                random: true, straight: false, out_mode: "out",
                bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: !isMobile(), mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
}
