// Emergency Calls Simulation Script

// Get modal elements
const responseModal = document.getElementById('responseModal');
const modalTitle = document.getElementById('modalTitle');
const modalCaller = document.getElementById('modalCaller');
const modalLocation = document.getElementById('modalLocation');
const modalTime = document.getElementById('modalTime');
const confirmResponse = document.getElementById('confirmResponse');
const cancelResponse = document.getElementById('cancelResponse');
const closeBtn = document.querySelector('.close');

// Current call being responded to
let currentCall = null;

// Function to simulate incoming emergency call
function simulateIncomingCall() {
    const callers = ['Patient C', 'Patient E', 'Patient F', 'Patient G'];
    const locations = ['Midtown', 'Suburb', 'City Center', 'Business District', 'Residential Area'];
    const times = ['1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'];

    const randomCaller = callers[Math.floor(Math.random() * callers.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    const randomTime = times[Math.floor(Math.random() * times.length)];

    const newCallItem = document.createElement('div');
    newCallItem.className = 'emergency-call-item';
    newCallItem.setAttribute('data-caller', randomCaller);
    newCallItem.setAttribute('data-location', randomLocation);
    newCallItem.setAttribute('data-time', randomTime);
    newCallItem.innerHTML = `
        <h4>📞 ${randomCaller}</h4>
        <p>Location: ${randomLocation}</p>
        <p>Time: ${randomTime}</p>
        <button class="respond-btn">Respond</button>
    `;

    const emergencyCallsList = document.getElementById('emergencyCallsList');
    emergencyCallsList.appendChild(newCallItem);

    // Show notification
    showIncomingCallNotification(randomCaller, randomLocation);

    // Add event listener to the new respond button
    newCallItem.querySelector('.respond-btn').addEventListener('click', function() {
        const caller = this.parentElement.getAttribute('data-caller');
        const location = this.parentElement.getAttribute('data-location');
        const time = this.parentElement.getAttribute('data-time');
        showResponseModal(caller, location, time);
    });
}

// Function to show incoming call notification
function showIncomingCallNotification(caller, location) {
    let notification = document.getElementById('incomingCallNotification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'incomingCallNotification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
            color: white;
            padding: 15px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            z-index: 1001;
            animation: slideIn 0.5s ease-out;
        `;
        document.body.appendChild(notification);
    }

    notification.innerHTML = `
        <div>🚨 Incoming Emergency Call!</div>
        <div>From: ${caller}</div>
        <div>Location: ${location}</div>
        <button id="dismissNotification" style="margin-top: 10px; background: white; color: #e53e3e; border: none; padding: 5px 10px; border-radius: 5px;">Dismiss</button>
    `;

    // Add event listener to dismiss button
    document.getElementById('dismissNotification').addEventListener('click', function() {
        notification.style.display = 'none';
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 10000);
}

// Function to show response modal
function showResponseModal(caller, location, time) {
    currentCall = { caller, location, time };

    modalCaller.textContent = caller;
    modalLocation.textContent = location;
    modalTime.textContent = time;

    responseModal.style.display = 'block';
}

// Function to handle response confirmation
function handleResponseConfirmation() {
    if (currentCall) {
        // Close the response modal
        responseModal.style.display = 'none';

        // Start the calling simulation
        simulateCallToPatient(currentCall.caller, currentCall.location);
        currentCall = null;
    }
}

// Function to simulate calling the patient
function simulateCallToPatient(patientName, location) {
    // Create calling overlay
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
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1002;
            color: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        `;
        document.body.appendChild(callingOverlay);
    }

    // Show initial calling state
    callingOverlay.innerHTML = `
        <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); animation: pulse 1s infinite;">
            <div style="font-size: 2em; margin-bottom: 20px;">📞</div>
            <div style="font-size: 1.5em; margin-bottom: 10px;">Calling ${patientName}...</div>
            <div style="font-size: 1.1em; opacity: 0.8;">Location: ${location}</div>
            <div style="font-size: 0.9em; margin-top: 20px; opacity: 0.7;">Ringing...</div>
        </div>
    `;
    callingOverlay.style.display = 'flex';

    // Simulate call states
    let callState = 0;
    const callStates = [
        { text: 'Ringing...', duration: 3000 },
        { text: 'Connected to Emergency Services', duration: 2000 },
        { text: `${patientName} is on the line`, duration: 2000 },
        { text: 'Help is on the way!', duration: 2000 }
    ];

    function updateCallState() {
        if (callState < callStates.length) {
            const state = callStates[callState];
            callingOverlay.querySelector('div').innerHTML = `
                <div style="font-size: 2em; margin-bottom: 20px;">📞</div>
                <div style="font-size: 1.5em; margin-bottom: 10px;">Calling ${patientName}...</div>
                <div style="font-size: 1.1em; opacity: 0.8;">Location: ${location}</div>
                <div style="font-size: 0.9em; margin-top: 20px; opacity: 0.7;">${state.text}</div>
            `;

            setTimeout(() => {
                callState++;
                updateCallState();
            }, state.duration);
        } else {
            // Call completed
            callingOverlay.innerHTML = `
                <div style="text-align: center; padding: 30px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); border-radius: 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
                    <div style="font-size: 2em; margin-bottom: 20px;">✅</div>
                    <div style="font-size: 1.5em; margin-bottom: 10px;">Call Completed</div>
                    <div style="font-size: 1.1em; margin-bottom: 10px;">Emergency response dispatched to:</div>
                    <div style="font-size: 1.2em; font-weight: bold;">${patientName}</div>
                    <div style="font-size: 1em; opacity: 0.9;">Location: ${location}</div>
                    <button id="endCallBtn" style="margin-top: 20px; padding: 10px 20px; background: white; color: #38a169; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Close</button>
                </div>
            `;

            // Add event listener to close button
            document.getElementById('endCallBtn').addEventListener('click', function() {
                callingOverlay.style.display = 'none';
            });

            // Auto-close after 10 seconds
            setTimeout(() => {
                callingOverlay.style.display = 'none';
            }, 10000);
        }
    }

    // Start the call simulation
    setTimeout(updateCallState, 1000);
}

// Function to handle response cancellation
function handleResponseCancellation() {
    responseModal.style.display = 'none';
    currentCall = null;
}

// Event listeners
document.getElementById('simulateCallBtn').addEventListener('click', simulateIncomingCall);

confirmResponse.addEventListener('click', handleResponseConfirmation);
cancelResponse.addEventListener('click', handleResponseCancellation);

closeBtn.addEventListener('click', function() {
    responseModal.style.display = 'none';
    currentCall = null;
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === responseModal) {
        responseModal.style.display = 'none';
        currentCall = null;
    }
});

// Add event listeners to existing respond buttons
document.querySelectorAll('.respond-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const item = this.parentElement;
        const caller = item.getAttribute('data-caller');
        const location = item.getAttribute('data-location');
        const time = item.getAttribute('data-time');
        showResponseModal(caller, location, time);
    });
});
