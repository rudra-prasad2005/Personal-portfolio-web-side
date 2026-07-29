// ------------------------------------------
// The Developer Dispatch — interactivity
// ------------------------------------------

// Dynamic date in the top bar
(function setDate() {
  const el = document.getElementById('today-date');
  if (!el) return;
  const fmt = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  const formatted = fmt.format(new Date()).toUpperCase();
  el.textContent = formatted;
})();

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
  toast.style.background = isError ? '#8a0e16' : '#14110d';
  toast.style.borderColor = isError ? '#f3ecd8' : '#b8121c';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4500);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'FILING...';

    try {
      const formData = new FormData(form);
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const result = await response.json();

      if (response.ok && result.success) {
        const name = (formData.get('name') || '').toString().trim();
        showToast(`Thanks${name ? ', ' + name : ''}! Your telegram has been received.`);
        form.reset();
      } else {
        showToast(result.message || 'Something went wrong. Try again.', true);
      }
    } catch (err) {
      showToast('Network error. Check your connection and try again.', true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

// Smooth scroll for in-page links (already enabled via CSS, but
// this gives a small offset so the section doesn't sit under the masthead)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
