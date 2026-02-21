document.addEventListener('DOMContentLoaded', () => {
    const socket = io(); // Connect to server

    // Load and display doctor's responses
    loadDoctorResponses();

    document.querySelectorAll('.dashboard-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-page');
            if (target) {
                // Check if it's a call card
                if (target.includes('video') || target.includes('audio')) {
                    const callType = target.includes('video') ? 'video' : 'audio';
                    socket.emit('request-call', {
                        callType: callType,
                        patientInfo: { name: 'Patient Name', location: 'Location' } // Replace with actual patient info
                    });
                    // Redirect to doctor dashboard after emitting
                    window.location.href = 'dashboard_doctor.html';
                } else {
                    // Add fade out effect
                    document.body.classList.add('fade-out');
                    setTimeout(() => {
                        window.location.href = target;
                    }, 500); // Match CSS transition time
                }
            }
        });
    });

    const emergencyBtn = document.querySelector('.emergency-btn');
    if (emergencyBtn) {
        emergencyBtn.addEventListener('click', () => {
            alert('Emergency contact activated! Calling saved contact...');
            // Here you can add real call/SMS functionality if backend is connected

            // Assume nearest hospital is City General Hospital
            const nearestHospital = 'City General Hospital';

            // Show message to user
            alert(`Emergency alert sent to ${nearestHospital}. Ambulance dispatched from ${nearestHospital}.`);
        });
    }

});

// Function to load and display doctor's responses
function loadDoctorResponses() {
    const queriesDiv = document.querySelector('.queries');
    const responses = JSON.parse(localStorage.getItem('doctorResponses')) || [];

    if (responses.length === 0) {
        queriesDiv.innerHTML = '<div class="no-queries"><i class="icon">📭</i> No responses yet.</div>';
        return;
    }

    queriesDiv.innerHTML = '';
    responses.forEach((response, index) => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'query-item';
        responseDiv.innerHTML = `
            <h4><i class="icon">💬</i> Doctor's Advice</h4>
            <p><strong>Query:</strong> ${response.query}</p>
            <p><strong>Response:</strong> ${response.response}</p>
            ${response.prescription ? `<p><strong>Prescription:</strong> ${response.prescription}</p>` : ''}
            ${response.followUp ? `<p><strong>Follow-up Date:</strong> ${response.followUp}</p>` : ''}
            <small><i class="icon">📅</i> Date: ${response.date}</small>
            <button class="remove-btn" data-index="${index}">Remove</button>
        `;
        queriesDiv.appendChild(responseDiv);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeResponse(index);
        });
    });
}

// Function to remove a response
function removeResponse(index) {
    let responses = JSON.parse(localStorage.getItem('doctorResponses')) || [];
    responses.splice(index, 1);
    localStorage.setItem('doctorResponses', JSON.stringify(responses));
    loadDoctorResponses(); // Re-render
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
                    window.location.href = 'edit_profile.html';
                    break;
                case 'manage-preferences':
                    window.location.href = 'manage_preferences.html';
                    break;
                case 'notifications':
                    window.location.href = 'patient_notifications.html';
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




