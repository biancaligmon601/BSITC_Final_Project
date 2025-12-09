// simple interactive behaviors for the demo page
document.addEventListener('DOMContentLoaded', () => {
  // set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();

  // Start Search button scrolls down to search card
  const startBtn = document.getElementById('startSearchBtn');
  const searchCard = document.querySelector('.search-card');
  if (startBtn && searchCard) {
    startBtn.addEventListener('click', () => {
      searchCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // focus first input
      const input = searchCard.querySelector('input[type="text"]');
      if (input) input.focus();
    });
  }

  // Explore Button shows a simple alert with chosen values (placeholder for real action)
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const loc = document.getElementById('locationInput').value || 'Anywhere';
      const date = document.getElementById('dateInput').value || 'Flexible dates';
      const ppl = document.getElementById('peopleInput').value || 1;
      
    });
  }

  // Subscribe Form: very basic "thank you" UX
  const subscribeForm = document.getElementById('subscribeForm');
  if (subscribeForm) {
    subscribeForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const email = document.getElementById('emailInput').value.trim();
      if (!email) {
        alert('Please enter your email address.');
        return;
      }
      // In production you'd send this to your server
      subscribeForm.reset();
      alert('Thanks! You are subscribed — watch for deals in your inbox.');
    });
  }

  // small accessibility: keyboard enter on card buttons logs
  document.querySelectorAll('.card .btn-small').forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Open details for this destination (demo).');
    });
  });
});
