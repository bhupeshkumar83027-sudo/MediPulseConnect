document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('preferences-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the data to the server
        // For now, just show a success message
        alert('Preferences saved successfully!');
        // Optionally, redirect back to dashboard
        // window.location.href = 'dashboard_patient.html';
    });
});
