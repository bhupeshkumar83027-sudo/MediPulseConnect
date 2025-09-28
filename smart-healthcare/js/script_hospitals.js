
// Get modal elements
const modal = document.getElementById('hospitalModal');
const modalTitle = document.getElementById('modalTitle');
const modalAddress = document.getElementById('modalAddress');
const modalDistance = document.getElementById('modalDistance');
const modalPhone = document.getElementById('modalPhone');
const emergencyCall = document.getElementById('emergencyCall');
const viewOnMap = document.getElementById('viewOnMap');
const closeBtn = document.querySelector('.close');

// Add event listeners to hospital items
document.querySelectorAll('.hospital-item').forEach(item => {
    item.addEventListener('click', function() {
        const name = this.getAttribute('data-name');
        const address = this.getAttribute('data-address');
        const distance = this.getAttribute('data-distance');
        const phone = this.getAttribute('data-phone');

        // Populate modal with hospital details
        modalTitle.textContent = name;
        modalAddress.textContent = address;
        modalDistance.textContent = distance;
        modalPhone.textContent = phone;

        // Set emergency call link
        emergencyCall.href = `tel:${phone}`;

        // Set map link
        viewOnMap.href = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;

        // Show modal
        modal.style.display = 'block';
    });
});

// Close modal when clicking on close button
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside the modal content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Add event listener for emergency call button
emergencyCall.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent immediate navigation

    const phone = modalPhone.textContent;

    // Show calling feedback
    showCallingFeedback(phone);

    // For mobile devices, the tel: link will work
    // For desktop, show the phone number
    setTimeout(() => {
        if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            alert(`Call this number: ${phone}`);
        }
    }, 1000); // Delay to show feedback first
});

// Function to show calling feedback
function showCallingFeedback(phone) {
    // Create or update calling overlay
    let callingOverlay = document.getElementById('callingOverlay');
    if (!callingOverlay) {
        callingOverlay = document.createElement('div');
        callingOverlay.id = 'callingOverlay';
        callingOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            color: white;
            font-size: 1.5em;
            text-align: center;
        `;
        document.body.appendChild(callingOverlay);
    }

    callingOverlay.innerHTML = `
        <div>
            <div>📞 Calling ${phone}...</div>
            <div style="margin-top: 10px; font-size: 0.8em;">Please wait...</div>
        </div>
    `;
    callingOverlay.style.display = 'flex';

    // Hide the overlay after 3 seconds
    setTimeout(() => {
        callingOverlay.style.display = 'none';
    }, 3000);
}


