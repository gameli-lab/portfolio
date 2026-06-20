/**
 * TORVEX PORTFOLIO — script.js
 * Benjamin Torfu | torvex.info
 * Accessible, performant, progressive enhancement
 */

'use strict';

/* ---- Theme Management ---- */
const ThemeManager = (() => {
  const STORAGE_KEY = 'torvex-theme';
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  const getPreferred = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  };

  const apply = (theme) => {
    html.dataset.theme = theme;
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    localStorage.setItem(STORAGE_KEY, theme);
  };

  const init = () => {
    apply(getPreferred());

    toggle.addEventListener('click', () => {
      apply(html.dataset.theme === 'dark' ? 'light' : 'dark');
    });

    // Sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) apply(e.newValue);
    });
  };

  return { init };
})();


/* ---- Mobile Navigation ---- */
const MobileNav = (() => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-menu');

  const open = () => {
    hamburger.setAttribute('aria-expanded', 'true');
    navLinks.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    hamburger.setAttribute('aria-expanded', 'false');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  };

  const init = () => {
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });

    // Close on link click
    navLinks.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', close);
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        close();
        hamburger.focus();
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        close();
      }
    });
  };

  return { init };
})();


/* ---- Smooth Scroll ---- */
const SmoothScroll = (() => {
  const init = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href').slice(1);
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Maintain focus accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      });
    });
  };

  return { init };
})();


/* ---- Typed Text Effect ---- */
const TypeWriter = (() => {
  const phrases = [
    'Software Engineer',
    'Backend Developer',
    'Math Educator',
    'EdTech Builder',
    'ALX Graduate',
    'Problem Solver',
  ];

  const el = document.getElementById('typed-text');
  let pIdx = 0;
  let cIdx = 0;
  let deleting = false;
  let paused = false;

  const SPEED_TYPE = 85;
  const SPEED_DELETE = 45;
  const PAUSE_AFTER = 1800;
  const PAUSE_BEFORE = 300;

  const tick = () => {
    if (!el) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = phrases[0];
      return;
    }

    const current = phrases[pIdx];

    if (!deleting && cIdx <= current.length) {
      el.textContent = current.slice(0, cIdx);
      cIdx++;
      if (cIdx > current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; tick(); }, PAUSE_AFTER);
        return;
      }
      setTimeout(tick, SPEED_TYPE);
    } else if (deleting && cIdx >= 0) {
      el.textContent = current.slice(0, cIdx);
      cIdx--;
      if (cIdx < 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        cIdx = 0;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }
      setTimeout(tick, SPEED_DELETE);
    }
  };

  const init = () => {
    if (!el) return;
    setTimeout(tick, 600);
  };

  return { init };
})();


/* ---- Scroll Reveal ---- */
const ScrollReveal = (() => {
  const init = () => {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

    items.forEach(el => observer.observe(el));
  };

  return { init };
})();


/* ---- Skill Bar Animations ---- */
const SkillBars = (() => {
  const init = () => {
    const fills = document.querySelectorAll('.skill-bar__fill');
    if (!fills.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      fills.forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          requestAnimationFrame(() => {
            fill.style.width = fill.dataset.width + '%';
          });
          observer.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });

    fills.forEach(fill => observer.observe(fill));
  };

  return { init };
})();


/* ---- Active Nav Link on Scroll ---- */
const ActiveNav = (() => {
  const init = () => {
    const sections = document.querySelectorAll('section[id], div[id="home"]');
    const links = document.querySelectorAll('.nav__link');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            link.classList.toggle(
              'nav__link--active',
              link.getAttribute('href') === '#' + entry.target.id
            );
            link.ariaCurrent = link.getAttribute('href') === '#' + entry.target.id ? 'page' : null;
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-10% 0px -50% 0px' });

    sections.forEach(s => observer.observe(s));
  };

  return { init };
})();


/* ---- Back to Top ---- */
const BackToTop = (() => {
  const btn = document.getElementById('back-to-top');

  const init = () => {
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.hidden = window.scrollY < 400;
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  return { init };
})();


/* ---- Contact Form ---- */
const ContactForm = (() => {
  const form = document.getElementById('contact-form');

  const validate = (field, errorId, message) => {
    const err = document.getElementById(errorId);
    if (!field.validity.valid) {
      field.classList.add('is-error');
      err.textContent = message;
      return false;
    }
    field.classList.remove('is-error');
    err.textContent = '';
    return true;
  };

  const init = () => {
    if (!form) return;

    const nameField = document.getElementById('contact-name');
    const emailField = document.getElementById('contact-email');
    const msgField = document.getElementById('contact-message');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

    // Live validation
    nameField.addEventListener('blur', () =>
      validate(nameField, 'name-error', 'Please enter your name.'));
    emailField.addEventListener('blur', () =>
      validate(emailField, 'email-error', 'Please enter a valid email address.'));
    msgField.addEventListener('blur', () =>
      validate(msgField, 'message-error', 'Please write a message.'));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const validName = validate(nameField, 'name-error', 'Please enter your name.');
      const validEmail = validate(emailField, 'email-error', 'Please enter a valid email address.');
      const validMsg = validate(msgField, 'message-error', 'Please write a message.');

      if (!validName || !validEmail || !validMsg) {
        // Focus the first error
        const firstError = form.querySelector('.is-error');
        if (firstError) firstError.focus();
        return;
      }

      // Simulate send (replace with real endpoint)
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      submitBtn.textContent = 'Sending...';

      await new Promise(r => setTimeout(r, 1400)); // Simulated async

      form.reset();
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.textContent = 'Send Message';
      successMsg.hidden = false;
      successMsg.focus();

      setTimeout(() => { successMsg.hidden = true; }, 5000);
    });
  };

  return { init };
})();


/* ---- Copyright Year ---- */
const setYear = () => {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
};


/* ---- Init All ---- */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  MobileNav.init();
  SmoothScroll.init();
  TypeWriter.init();
  ScrollReveal.init();
  SkillBars.init();
  ActiveNav.init();
  BackToTop.init();
  ContactForm.init();
  setYear();
});
