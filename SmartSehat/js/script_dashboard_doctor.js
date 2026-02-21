// JavaScript for dashboard_doctor.html
document.addEventListener('DOMContentLoaded', () => {
    // Add some interactivity, e.g., animate cards on load
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });

    // Socket setup
const socket = io();

// Global variables
let currentPatientSocketId = null;
let currentCallType = null;

// Elements
const videoCallSection = document.getElementById("video-call-section");
const callTypeLabel = document.getElementById("call-type");
const localVideo = document.getElementById("localVideo");
const doctorVideo = document.getElementById("doctorVideo");

const acceptCallBtn = document.getElementById("accept-call-btn");
const endCallBtn = document.getElementById("end-call-btn");

// Incoming Call Modal Elements
const incomingCallModal = document.getElementById("incoming-call-modal");
const callTypePopup = document.getElementById("call-type-popup");
const patientInfoPopup = document.getElementById("patient-info-popup");
const acceptCallPopup = document.getElementById("accept-call-popup");
const declineCallPopup = document.getElementById("decline-call-popup");

// WebRTC setup
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// 📌 Incoming request listener
socket.on("incoming-request", (data) => {
    currentPatientSocketId = data.patientSocketId;
    currentCallType = data.callType; // "video" / "voice"

    // Show modal
    incomingCallModal.style.display = "flex";
    callTypePopup.textContent = `📞 Incoming ${currentCallType} Call`;
    patientInfoPopup.textContent = `${data.patientInfo?.name || "Patient"} is calling...`;
});

// 📌 Accept Call (from Popup)
acceptCallPopup.addEventListener("click", () => {
    incomingCallModal.style.display = "none";
    startCall();
});

// 📌 Decline Call
declineCallPopup.addEventListener("click", () => {
    socket.emit("decline-request", { patientSocketId: currentPatientSocketId });
    incomingCallModal.style.display = "none";
});

// 📌 Accept Call Function
async function startCall() {
    videoCallSection.style.display = "block";
    acceptCallBtn.style.display = "none";
    endCallBtn.style.display = "inline-block";

    peerConnection = new RTCPeerConnection(config);

    // Local media
    try {
        const stream = await navigator.mediaDevices.getUserMedia(
            currentCallType === "video" 
                ? { video: true, audio: true } 
                : { audio: true }
        );
        localVideo.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
    } catch (err) {
        console.error("Media error:", err);
    }

    // Remote stream
    peerConnection.ontrack = (event) => {
        doctorVideo.srcObject = event.streams[0];
    };

    // ICE Candidates
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit("doctor-ice-candidate", {
                candidate: event.candidate,
                patientSocketId: currentPatientSocketId
            });
        }
    };

    // Create and send answer
    const offer = await socket.emitWithAck("request-offer", {
        patientSocketId: currentPatientSocketId
    });
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("doctor-answer", {
        answer,
        patientSocketId: currentPatientSocketId
    });
}

// 📌 End Call
endCallBtn.addEventListener("click", () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    videoCallSection.style.display = "none";
    socket.emit("end-call", { patientSocketId: currentPatientSocketId });
});

    // Function to add a notification
    function addNotification(message, type = 'info', timeout = 5000) {
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.textContent = message;

        // Add notification to container
        notificationsContainer.appendChild(notification);

        // Auto-remove after timeout
        setTimeout(() => {
            notification.classList.add('fade-out');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, timeout);
    }

    // Function to add incoming call notification with buttons
    function addIncomingCallNotification(message, patientSocketId, callType) {
        const notification = document.createElement('div');
        notification.classList.add('notification', 'incoming-call-notification');
        notification.innerHTML = `
            <span>${message}</span>
            <div class="notification-buttons" style="display: flex; justify-content: space-around; margin-top: 10px;">
                <button class="accept-btn" style="background: green; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Accept</button>
                <button class="decline-btn" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Decline</button>
            </div>
        `;

        // Add event listeners to buttons
        const acceptBtn = notification.querySelector('.accept-btn');
        const declineBtn = notification.querySelector('.decline-btn');

        acceptBtn.addEventListener('click', () => {
            // Directly accept call
            acceptCall();
            notification.remove();
        });

        declineBtn.addEventListener('click', () => {
            // Trigger decline
            declineCallPopup.click(); // Simulate popup decline
            notification.remove();
        });

        // Add notification to container
        notificationsContainer.appendChild(notification);
        notificationsContainer.style.display = 'flex'; // Show notifications when incoming call

        // Do not auto-remove, let user interact
    }

    // Incoming call notification
    socket.on('incoming-request', (data) => {
        currentPatientSocketId = data.patientSocketId;
        currentCallType = data.callType;
        addIncomingCallNotification(`Incoming ${data.callType} call from ${data.patientInfo.name || 'Unknown'}`, data.patientSocketId, data.callType);
    });

    async function acceptCall() {
        incomingCallModal.style.display = 'none';
        // Proceed to accept call
        socket.emit('accept-request', { patientSocketId: currentPatientSocketId });
        callTypeH2.textContent = `${currentCallType.charAt(0).toUpperCase() + currentCallType.slice(1)} Call`;
        videoCallSection.style.display = 'block';
        if (currentCallType === 'video') {
            doctorVideo.style.display = 'block';
        } else {
            doctorVideo.style.display = 'none';
        }
        acceptCallBtn.style.display = 'none';
        endCallBtn.style.display = 'inline';

        pc = new RTCPeerConnection();
        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: currentCallType === 'video', audio: true });
            localVideo.srcObject = localStream;
            pc.addStream(localStream);

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('webrtc-ice', { to: currentPatientSocketId, candidate: event.candidate });
                }
            };

            pc.onaddstream = (event) => {
                if (currentCallType === 'video') {
                    doctorVideo.srcObject = event.stream;
                }
            };
        } catch (err) {
            alert('Error accessing media: ' + err.message);
        }
    }

    acceptCallPopup.addEventListener('click', acceptCall);

    declineCallPopup.addEventListener('click', () => {
        socket.emit('decline-request', { patientSocketId: currentPatientSocketId });
        incomingCallModal.style.display = 'none';
    });



    endCallBtn.addEventListener('click', () => {
        socket.emit('end-session', { peerSocketId: currentPatientSocketId });
        if (localStream) localStream.getTracks().forEach(track => track.stop());
        if (pc) pc.close();
        doctorVideo.srcObject = null;
        const patientNameDiv = document.getElementById('patient-name-display');
        if (patientNameDiv) patientNameDiv.remove();
        videoCallSection.style.display = 'none';
        acceptCallBtn.style.display = 'inline';
        endCallBtn.style.display = 'none';
    });

    socket.on('session-ended', () => {
        if (localStream) localStream.getTracks().forEach(track => track.stop());
        if (pc) pc.close();
        doctorVideo.srcObject = null;
        const patientNameDiv = document.getElementById('patient-name-display');
        if (patientNameDiv) patientNameDiv.remove();
        videoCallSection.style.display = 'none';
        acceptCallBtn.style.display = 'inline';
        endCallBtn.style.display = 'none';
    });

    socket.on('webrtc-offer', async (data) => {
        try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            socket.emit('webrtc-answer', { to: data.from, sdp: pc.localDescription });
        } catch (error) {
            console.error('Error handling offer:', error);
        }
    });

    socket.on('webrtc-answer', async (data) => {
        try {
            await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
        } catch (error) {
            console.error('Error handling answer:', error);
        }
    });

    socket.on('webrtc-ice', (data) => {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

   
});

 // Profile Dropdown Functionality
    const profileButton = document.getElementById('doctor-profile-button');
    const profileDropdown = document.getElementById('doctor-profile-dropdown');
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
                        window.location.href = 'doctor_profile.html';
                        break;
                    case 'manage-preferences':
                        window.location.href = 'manage_preferences.html';
                        break;
                    case 'notifications':
                        window.location.href = 'doctor_notifications.html';
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
