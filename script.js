const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const sections = document.querySelectorAll('main section[id]');
const navigationLinks = document.querySelectorAll('.nav-link');

if (sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navigationLinks.forEach((link) => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === `#${entry.target.id}` || (href === 'index.html' && entry.target.id === 'home'));
        });
      }
    });
  }, { rootMargin: '-35% 0px -55%', threshold: 0 });

  sections.forEach((section) => sectionObserver.observe(section));
}

const skillsSection = document.querySelector('#skills');
const progressSection = skillsSection || document.querySelector('.skills');
if (progressSection) {
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.progress-bar').forEach((bar) => {
          bar.style.width = `${bar.dataset.progress}%`;
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });
  skillObserver.observe(progressSection);
}

const form = document.querySelector('#contact-form');
const status = document.querySelector('.form-status');

const validators = {
  name: (value) => value.trim().length >= 2 ? '' : 'Please enter your name.',
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Please enter a valid email address.',
  subject: (value) => value.trim().length >= 3 ? '' : 'Please add a subject.',
  message: (value) => value.trim().length >= 10 ? '' : 'Please enter at least 10 characters.'
};

function validateField(field) {
  const error = validators[field.name](field.value);
  const errorElement = field.parentElement.querySelector('.field-error');
  field.classList.toggle('invalid', Boolean(error));
  field.setAttribute('aria-invalid', String(Boolean(error)));
  errorElement.textContent = error;
  return !error;
}

if (form) {
  form.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')];
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      status.textContent = 'Please correct the highlighted fields.';
      status.style.color = '#c83e32';
      fields.find((field) => field.classList.contains('invalid'))?.focus();
      return;
    }

    status.textContent = 'Thanks! Your message is ready to send.';
    status.style.color = '#477b50';
    form.reset();
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
