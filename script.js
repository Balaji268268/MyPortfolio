/* =====================================================
   Portfolio Script - Venkata Balaji Ananthagari
   Features: Particles, Scroll Animations, Nav, Form
   ===================================================== */

// ── Particles System ──────────────────────────────────
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * canvas.width;
    this.y     = Math.random() * canvas.height;
    this.size  = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const colors = ['rgba(124,58,237,', 'rgba(6,182,212,', 'rgba(236,72,153,', 'rgba(255,255,255,'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.opacity + ')';
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(120, Math.floor((canvas.width * canvas.height) / 10000));
  for (let i = 0; i < count; i++) particles.push(new Particle());
}

function drawConnections() {
  const maxDist = 100;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const opacity = (1 - dist / maxDist) * 0.15;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(124,58,237,${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ── Navbar Scroll Effect ──────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
  updateActiveNav();
}, { passive: true });

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  links.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current
      ? 'var(--text-primary)' : '';
  });
}

// ── Mobile Menu ───────────────────────────────────────
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const ham  = document.getElementById('hamburger');
  menu.classList.toggle('open');
  ham.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('mobileMenu').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}
document.addEventListener('click', (e) => {
  const menu = document.getElementById('mobileMenu');
  const ham  = document.getElementById('hamburger');
  if (menu.classList.contains('open') && !menu.contains(e.target) && !ham.contains(e.target)) {
    closeMobileMenu();
  }
});

// ── Scroll Reveal ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Animate skill bars inside
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.classList.add('animated');
        });
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// ── Smooth active link on click ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Skill Bar observer (global trigger) ───────────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.classList.add('animated');
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(cat => skillObserver.observe(cat));

// ── Typing Effect (Hero Subtitle) ────────────────────
const roles = [
  'Python Developer',
  'ML Enthusiast',
  'Software Engineer',
  'Problem Solver'
];
let roleIdx = 0, charIdx = 0, isDeleting = false;
const subtitleEl = document.querySelector('.hero-subtitle');
if (subtitleEl) {
  function typeEffect() {
    const current = roles[roleIdx];
    if (isDeleting) {
      subtitleEl.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        charIdx = 0;
        setTimeout(typeEffect, 500);
        return;
      }
    } else {
      subtitleEl.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2200);
        return;
      }
    }
    setTimeout(typeEffect, isDeleting ? 60 : 90);
  }
  setTimeout(typeEffect, 1200);
}

// ── Counter Animation (Stats) ─────────────────────────
function animateCounter(el, target, decimals = 0, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = (eased * target).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const nums = entry.target.querySelectorAll('.stat-num');
      nums.forEach(num => {
        const text = num.textContent.trim();
        if (text.includes('.')) {
          const val = parseFloat(text);
          animateCounter(num, val, 2);
        } else {
          const val = parseInt(text.replace(/\D/g, ''), 10);
          if (!isNaN(val)) animateCounter(num, val, 0, text.replace(/[0-9]/g, ''));
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// ── Contact Form ──────────────────────────────────────
function handleFormSubmit() {
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim();
  const message = document.getElementById('contactMessage').value.trim();
  const btn     = document.getElementById('submitBtn');

  if (!name || !email || !message) {
    showToast('Please fill in all required fields!', 'error');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showToast('Please enter a valid email address!', 'error');
    return;
  }

  btn.textContent = 'Sending... ⏳';
  btn.disabled = true;

  const mailtoURL = `mailto:venkatabalaji529@gmail.com?subject=${encodeURIComponent(subject || 'Portfolio Contact')}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

  setTimeout(() => {
    window.location.href = mailtoURL;
    btn.textContent = 'Message Sent! ✅';
    showToast('Opening your email client...', 'success');
    setTimeout(() => {
      btn.textContent = 'Send Message 🚀';
      btn.disabled = false;
    }, 3000);
  }, 800);
}

// ── Toast Notifications ───────────────────────────────
function showToast(message, type = 'info') {
  const existing = document.querySelector('.portfolio-toast');
  if (existing) existing.remove();

  const colors = { success: '#10b981', error: '#ef4444', info: '#06b6d4', warning: '#f59e0b' };
  const icons  = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  const toast = document.createElement('div');
  toast.className = 'portfolio-toast';
  toast.style.cssText = `
    position:fixed; bottom:30px; right:30px; z-index:9999;
    background:rgba(10,10,31,0.95); border:1.5px solid ${colors[type]};
    border-radius:12px; padding:14px 20px;
    display:flex; align-items:center; gap:10px;
    font-family:'Inter',sans-serif; font-size:0.9rem; font-weight:600;
    color:#f1f5f9; max-width:320px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);
    animation:slideInToast 0.4s cubic-bezier(0.4,0,0.2,1) both;
    backdrop-filter:blur(20px);
  `;
  toast.innerHTML = `<span style="font-size:1.2rem">${icons[type]}</span><span>${message}</span>`;

  const style = document.createElement('style');
  style.textContent = `@keyframes slideInToast{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}`;
  if (!document.querySelector('#toast-styles')) { style.id = 'toast-styles'; document.head.appendChild(style); }

  document.body.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'none'; toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ── Cursor Glow Effect ────────────────────────────────
let cursorGlow = null;
document.addEventListener('mousemove', (e) => {
  if (!cursorGlow) {
    cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position:fixed; width:300px; height:300px; border-radius:50%;
      background:radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%);
      pointer-events:none; z-index:0; transform:translate(-50%,-50%);
      transition:left 0.15s ease, top 0.15s ease;
    `;
    document.body.appendChild(cursorGlow);
  }
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

// ── Card Tilt Effect ──────────────────────────────────
document.querySelectorAll('.project-card, .highlight-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect    = card.getBoundingClientRect();
    const centerX = rect.left + rect.width  / 2;
    const centerY = rect.top  + rect.height / 2;
    const rotateX = -(e.clientY - centerY) / rect.height * 6;
    const rotateY =  (e.clientX - centerX) / rect.width  * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── Page Load ─────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.6s ease';
  setTimeout(() => { document.body.style.opacity = '1'; }, 50);
});
