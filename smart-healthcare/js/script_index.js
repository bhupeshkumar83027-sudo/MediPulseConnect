document.addEventListener('DOMContentLoaded', () => {
  const symptomCheckerBtn = document.getElementById('symptom-checker-btn');

  if (symptomCheckerBtn) {
    symptomCheckerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Redirect to language selection page
      window.location.href = 'language.html';
    });
  }

  // Add search form functionality
  const searchForm = document.querySelector('form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchForm.querySelector('input[type="text"]').value.trim();
      if (query) {
        // For demonstration, redirect to symptoms.html with query as a URL parameter
        window.location.href = `symptoms.html?search=${encodeURIComponent(query)}`;
      }
    });
  }
});
