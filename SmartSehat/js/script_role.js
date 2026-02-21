document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.role-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const role = this.getAttribute('data-role');
            if (role === 'patient') {
                window.location.href = 'symptoms.html';
            } else if (role === 'doctor') {
                window.location.href = 'login_doctor.html';
           
            }
        });
    });
});
