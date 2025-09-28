const form = document.getElementById('signup_patient_form');

form.addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
        const response = await fetch('php/signup_patient.php', {
            method: 'POST',
            body: formData
        });

        // Check if response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Show message
        alert(data.message);

        // Redirect if success
        if (data.status === 'success') {
            window.location.href = 'dashboard_patient.html';
        }

    } catch (err) {
        console.error('Fetch error:', err);
        alert('Server error. Please try again.');
    }
});
