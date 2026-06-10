/* ============================================================
   HAVEN PORTFOLIO — script.js
   Loader · Particles · Cursor · Navbar · Typed · Counters ·
   Scroll Reveal · Skill Bars · Project Filter · Form · Theme
   ============================================================ */

/* ─── LOADER ─────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1800);
});

/* ─── PARTICLE CANVAS ────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx   = canvas.getContext('2d');
  let W = window.innerWidth, H = window.innerHeight;
  canvas.width = W; canvas.height = H;

  const PARTICLE_COUNT = Math.min(80, Math.floor(W / 20));
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x:  Math.random() * W,
    y:  Math.random() * H,
    r:  Math.random() * 1.5 + 0.4,
    dx: (Math.random() - 0.5) * 0.4,
    dy: (Math.random() - 0.5) * 0.4,
    a:  Math.random() * 0.6 + 0.15,
  }));

  function getAccentColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#7c3aed';
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const accent = getAccentColor();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${p.a})`;
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > W) p.dx *= -1;
      if (p.y < 0 || p.y > H) p.dy *= -1;
    });
    // draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(124,58,237,${0.12 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W; canvas.height = H;
  });
})();

/* ─── CURSOR GLOW ────────────────────────────────────────────── */
(function initCursor() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let cx = mx, cy = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.left = cx + 'px';
    glow.style.top  = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
})();

/* ─── THEME TOGGLE ───────────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn.querySelector('i');
  const saved = localStorage.getItem('haven-theme');
  if (saved === 'light') { document.body.classList.add('light'); icon.className = 'fas fa-sun'; }

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('haven-theme', isLight ? 'light' : 'dark');
  });
})();

/* ─── NAVBAR ─────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggleBtn = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll: add scrolled class + close mobile menu on outside click
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  toggleBtn.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    toggleBtn.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    toggleBtn.classList.remove('open');
  }));

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => observer.observe(s));
})();

/* ─── TYPED TEXT EFFECT ──────────────────────────────────────── */
(function initTyped() {
  const el    = document.getElementById('typed-role');
  if (!el) return;
  const words = [
    'Web Applications.',
    'Beautiful UIs.',
    'Full-Stack Solutions.',
    'Digital Experiences.',
  ];
  let wIndex = 0, cIndex = 0, deleting = false;

  function type() {
    const word    = words[wIndex];
    const current = deleting
      ? word.slice(0, cIndex--)
      : word.slice(0, ++cIndex);

    el.textContent = current;

    let delay = deleting ? 60 : 110;

    if (!deleting && cIndex === word.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && cIndex === 0) {
      deleting = false;
      wIndex = (wIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
})();

/* ─── COUNTER ANIMATION ──────────────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  const io   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      let count    = 0;
      const step   = Math.ceil(target / 40);
      const tick   = setInterval(() => {
        count += step;
        if (count >= target) { el.textContent = target; clearInterval(tick); }
        else el.textContent = count;
      }, 45);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  nums.forEach(n => io.observe(n));
})();

/* ─── SCROLL REVEAL ──────────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  const io  = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('revealed'), i * 80);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
})();

/* ─── SKILL BARS ─────────────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-width]');
  const io   = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.dataset.width + '%';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => io.observe(b));
})();

/* ─── PROJECT FILTER ─────────────────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
      });
    });
  });
})();

/* ─── CONTACT FORM ───────────────────────────────────────────── */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('button[type="submit"]');
  const text = document.getElementById('submit-text');

  btn.disabled  = true;
  text.textContent = 'Sending…';

  // Simulate async send
  setTimeout(() => {
    text.textContent = 'Message Sent! ✓';
    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    setTimeout(() => {
      e.target.reset();
      text.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.background = '';
    }, 3000);
  }, 1400);
}

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});