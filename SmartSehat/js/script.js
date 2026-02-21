// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Welcome screen fade out and redirect to language selection
    const welcome = document.getElementById('welcome');
    if (welcome) {
        // Fallback timeout in case animationend doesn't fire
        welcome.addEventListener('animationend', () => {
            window.location.href = './language.html';
        });
        setTimeout(() => {
            window.location.href = './language.html';
        }, 3500);
    }

    // Language selection buttons
    const langButtons = document.querySelectorAll('.lang-btn');
    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            window.location.href = './role.html';
        });
    });

    // Role selection buttons
    const roleButtons = document.querySelectorAll('.role-btn');
    roleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const role = btn.getAttribute('data-role');
            if (role === 'patient') {
                window.location.href = './login_patient.html';
            } else if (role === 'doctor') {
                window.location.href = './login_doctor.html';
            } else if (role === 'admin') {
                window.location.href = './login_admin.html';
            }
        });
    });

    // Emergency button on patient dashboard
    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            alert('Emergency button clicked! Implement call/SMS functionality here.');
        });
    }
});
