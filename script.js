// Mobile menu toggle
const toggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// Close menu when a link is tapped
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('open');
    navMenu.classList.remove('open');
  });
});

// Scroll-reveal animations
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// Contact form (Web3Forms)
const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.style.background = isError
    ? 'rgba(220, 60, 80, 0.95)'
    : 'rgba(122, 92, 255, 0.95)';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const originalText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    const formData = new FormData(form);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();

    if (response.ok && result.success) {
      const name = (formData.get('name') || '').toString().trim();
      showToast(`Thanks${name ? ', ' + name : ''}! Your message has been sent.`);
      form.reset();
    } else {
      showToast(result.message || 'Something went wrong. Please try again.', true);
    }
  } catch (err) {
    showToast('Network error. Please check your connection and try again.', true);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Typewriter effect for the hero tagline
const typedEl = document.getElementById('typed-text');
const words = ['Frontend Developer', 'Programmer', 'Web Designer', 'Problem Solver'];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  if (!typedEl) return;
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typedEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    typeSpeed = 1500;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    typeSpeed = 500;
  }

  setTimeout(typeEffect, typeSpeed);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeEffect, 500);
});
