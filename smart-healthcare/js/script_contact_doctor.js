// WebRTC setup for video and voice calls

// WebRTC setup for video and voice calls

const socket = io();

let localStream = null;
let pc = null;
let currentCallType = null;
let doctorSocketId = null;

const videoCallBtn = document.getElementById('video-call-btn');
const stopVideoBtn = document.getElementById('stop-video-btn');
const voiceCallBtn = document.getElementById('voice-call-btn');
const stopVoiceBtn = document.getElementById('stop-voice-btn');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const videoCallSection = document.getElementById('video-call-section');
const voiceCallSection = document.getElementById('voice-call-section');
const voiceCallNameDiv = document.getElementById('voice-call-name');

async function startVideoCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = localStream;
    videoCallBtn.style.display = 'none';
    videoCallSection.style.display = 'block';
    currentCallType = 'video';

    // Emit call request to server
    socket.emit('request-call', {
      callType: 'video',
      patientInfo: {
        name: localStorage.getItem('patientName') || 'Patient',
        location: localStorage.getItem('patientLocation') || ''
      }
    });
  } catch (err) {
    alert('Error accessing camera/microphone: ' + err.message);
  }
}

async function startVoiceCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    voiceCallBtn.style.display = 'none';
    voiceCallSection.style.display = 'block';
    voiceCallNameDiv.textContent = 'Connecting...';
    currentCallType = 'voice';

    // Emit call request to server
    socket.emit('request-call', {
      callType: 'voice',
      patientInfo: {
        name: localStorage.getItem('patientName') || 'Patient',
        location: localStorage.getItem('patientLocation') || ''
      }
    });
  } catch (err) {
    alert('Error accessing microphone: ' + err.message);
  }
}

function stopCall() {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  if (pc) {
    pc.close();
    pc = null;
  }
  remoteVideo.srcObject = null;
  localVideo.srcObject = null;
  videoCallSection.style.display = 'none';
  voiceCallSection.style.display = 'none';
  videoCallBtn.style.display = 'inline-block';
  voiceCallBtn.style.display = 'inline-block';
  socket.emit('end-session', { peerSocketId: doctorSocketId });
  currentCallType = null;
  doctorSocketId = null;
}

socket.on('call-request-sent', (data) => {
  if (data.status === 'pending') {
    alert('Call request sent. Waiting for doctor to accept.');
  } else if (data.status === 'no-doctor') {
    alert('No doctor available. Please try again later.');
    stopCall();
  }
});

socket.on('request-accepted', async (data) => {
  doctorSocketId = data.doctorSocketId;
  const doctorName = data.doctorName || 'Doctor';
  alert(`Doctor ${doctorName} accepted the call. Starting connection...`);

  // Update name display
  if (currentCallType === 'video') {
    document.getElementById('video-call-name').textContent = `Connected to: ${doctorName}`;
  } else {
    document.getElementById('voice-call-name').textContent = `Connected to: ${doctorName}`;
  }

  // Initialize WebRTC
  pc = new RTCPeerConnection();
  pc.addStream(localStream);

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('webrtc-ice', { to: doctorSocketId, candidate: event.candidate });
    }
  };

  pc.onaddstream = (event) => {
    if (currentCallType === 'video') {
      remoteVideo.srcObject = event.stream;
    }
  };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit('webrtc-offer', { to: doctorSocketId, sdp: pc.localDescription });
});

socket.on('webrtc-answer', async (data) => {
  await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
});

socket.on('webrtc-ice', (data) => {
  pc.addIceCandidate(new RTCIceCandidate(data.candidate));
});

socket.on('session-ended', () => {
  alert('Call ended by doctor.');
  stopCall();
});

videoCallBtn.addEventListener('click', startVideoCall);
stopVideoBtn.addEventListener('click', stopCall);
voiceCallBtn.addEventListener('click', startVoiceCall);
stopVoiceBtn.addEventListener('click', stopCall);

const sendBtn = document.querySelector('.send-btn');
const queryInput = document.getElementById('query');

sendBtn.addEventListener('click', () => {
  const query = queryInput.value.trim();

  if (!query) {
    alert('Please enter your query.');
    return;
  }

  // Store query in localStorage for frontend simulation
  let queries = JSON.parse(localStorage.getItem('patientQueries') || '[]');
  queries.unshift({
    patientName: localStorage.getItem('patientName') || 'Patient',
    query: query,
    timestamp: new Date().toISOString(),
    urgency: 'medium' // Default
  });
  localStorage.setItem('patientQueries', JSON.stringify(queries));

  // Emit to server if available (for future backend)
  socket.emit('patient-message', {
    query,
    patientName: localStorage.getItem('patientName') || 'Patient',
    timestamp: new Date().toISOString()
  });

  alert('Query sent to doctor.');
  queryInput.value = '';
});
