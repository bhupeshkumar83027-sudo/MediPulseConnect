document.addEventListener('DOMContentLoaded', function() {
    const welcome = document.getElementById('welcome');
    setTimeout(() => {
        welcome.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = 'language.html';
        }, 1000);
    }, 2000);
});
