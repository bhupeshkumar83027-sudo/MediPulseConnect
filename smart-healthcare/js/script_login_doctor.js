document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[placeholder="Email"]').value;
            const password = loginForm.querySelector('input[placeholder="Password"]').value;
            try {
                const res = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'dashboard_doctor.html';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    }
});

// --- Added by integrator: AJAX submit to backend for login_doctor ---
(function(){
  const form = document.getElementById('login_doctor_form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    // basic client-side validation: required fields not empty
    for (let pair of formData.entries()) {
      if (!pair[1]) {
        alert('Please fill all required fields.');
        return;
      }
    }
    fetch('php/login_doctor.php', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(res => {
        if (res.status === 'success') {
          alert(res.message || 'Success');
          if (res.redirect) window.location.href = res.redirect;
        } else {
          alert(res.message || 'Error');
        }
      })
      .catch(err => { console.error(err); alert('Network or server error'); });
  });
})();

