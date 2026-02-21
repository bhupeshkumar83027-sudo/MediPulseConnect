<?php
session_start();
if(!isset($_SESSION['user_id']) || $_SESSION['role'] != 'patient') {
    header("Location: login.php"); exit;
}
require 'db.php';
$stmt = $pdo->prepare("SELECT id, full_name FROM users WHERE id=?");
$stmt->execute([$_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
?>
<script>
window.USER = {
    id: "<?php echo $user['id']; ?>",
    name: "<?php echo addslashes($user['full_name']); ?>",
    role: "patient"
};
</script>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Patient Dashboard - Video Call</title>
<style>
body { font-family: Arial; text-align:center; margin-top:30px; }
video { width: 45%; margin:5px; border:1px solid #ccc; }
button { padding:10px 20px; margin:5px; }
</style>
</head>
<body>
<h1>🎥 Patient Dashboard</h1>
<p id="call-status"></p>
<video id="localVideo" autoplay muted></video>
<video id="remoteVideo" autoplay></video><br>
<button id="start-call-btn">Start Call</button>
<button id="end-call-btn">End Call</button>

<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();
const { id: USER_ID, name: USER_NAME } = window.USER;
let pc, localStream, currentDoctorSocketId;

const startBtn = document.getElementById('start-call-btn');
const endBtn = document.getElementById('end-call-btn');
const callStatus = document.getElementById('call-status');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

socket.on('connect', () => socket.emit('register-user', { userId: USER_ID, name: USER_NAME, role: 'patient' }));

startBtn.onclick = () => {
  socket.emit('request-doctor', { patientId: USER_ID, patientName: USER_NAME });
  callStatus.textContent = 'Requesting doctor...';
};

socket.on('request-sent', data => { callStatus.textContent = (data.status==='pending')?'Waiting for doctor...':'Doctor offline'; });

socket.on('request-accepted', async data => {
  currentDoctorSocketId = data.doctorSocketId;
  callStatus.textContent = 'Doctor accepted. Starting call...';
  pc = new RTCPeerConnection({ iceServers:[{urls:'stun:stun.l.google.com:19302'}] });

  try { localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true}); } catch(e){ alert(e); return; }
  localVideo.srcObject = localStream;
  localStream.getTracks().forEach(track=>pc.addTrack(track,localStream));

  pc.ontrack = e => remoteVideo.srcObject = e.streams[0];
  pc.onicecandidate = e => { if(e.candidate) socket.emit('webrtc-ice',{toSocketId:currentDoctorSocketId,candidate:e.candidate}); };

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  socket.emit('webrtc-offer',{toSocketId:currentDoctorSocketId,sdp:offer});
  startBtn.disabled = true;
});

socket.on('request-declined', ()=>callStatus.textContent='Doctor declined');

socket.on('webrtc-answer', async data => { await pc.setRemoteDescription(new RTCSessionDescription(data.sdp)); });
socket.on('webrtc-ice', data => { if(pc && data.candidate) pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error); });
socket.on('session-ended', ()=>{ if(localStream) localStream.getTracks().forEach(t=>t.stop()); if(pc) pc.close(); localVideo.srcObject=null; remoteVideo.srcObject=null; callStatus.textContent=''; startBtn.disabled=false; });

endBtn.onclick = () => { socket.emit('end-session',{peerSocketId:currentDoctorSocketId}); if(localStream)localStream.getTracks().forEach(t=>t.stop()); if(pc)pc.close(); localVideo.srcObject=null; remoteVideo.srcObject=null; callStatus.textContent=''; startBtn.disabled=false; };
</script>
</body>
</html>
