document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page) {
                window.location.href = page;
            }
        });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Redirect to logout page or perform logout logic
            window.location.href = 'index.html'; // Assuming index.html is the login or landing page
        });
    }

    // Profile Dropdown Functionality
    const profileButton = document.getElementById('admin-profile-button');
    const profileDropdown = document.getElementById('admin-profile-dropdown');
    let dropdownVisible = false;

    if (profileButton && profileDropdown) {
        profileButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownVisible = !dropdownVisible;
            profileDropdown.style.display = dropdownVisible ? 'block' : 'none';
        });

        // Handle dropdown item clicks
        profileDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.getAttribute('data-action');
            if (action) {
                switch (action) {
                    case 'edit-profile':
                        window.location.href = 'admin_profile.html';
                        break;
                    case 'manage-preferences':
                        window.location.href = 'manage_preferences.html';
                        break;
                    case 'notifications':
                        window.location.href = 'admin_notifications.html';
                        break;
                    case 'logout':
                        if (confirm('Are you sure you want to logout?')) {
                            window.location.href = 'index.html';
                        }
                        break;
                }
                dropdownVisible = false;
                profileDropdown.style.display = 'none';
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (dropdownVisible) {
                dropdownVisible = false;
                profileDropdown.style.display = 'none';
            }
        });
    }
});
