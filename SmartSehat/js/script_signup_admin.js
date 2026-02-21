// JavaScript for signup_admin.html
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.signup-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.querySelector('input[placeholder="Name"]').value;
            const email = form.querySelector('input[placeholder="Email"]').value;
            const password = form.querySelector('input[placeholder="Password"]').value;
            try {
                const res = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password, role: 'admin' })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Signup successful! Please login.');
                    window.location.href = 'login_admin.html';
                } else {
                    alert(data.error);
                }
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    }
});

// --- Added by integrator: AJAX submit to backend for signup_admin ---
(function(){
  const form = document.getElementById('signup_admin_form');
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
    fetch('php/signup_admin.php', { method: 'POST', body: formData })
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

