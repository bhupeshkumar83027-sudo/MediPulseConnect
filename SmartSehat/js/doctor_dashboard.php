<?php
session_start();
if(!isset($_SESSION['user_id']) || $_SESSION['role'] != 'doctor') {
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
    role: "doctor"
};
</script>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Doctor Dashboard - Video Call</title>
<style>
body { font-family: Arial; text-align:center; margin-top:30px; }
video { width: 45%; margin:5px; border:1px solid #ccc; }
button { padding:10px 20px; margin:5px; }
</style>
</head>
<body>
<h1>👩‍⚕️ Doctor Dashboard</h1>
<p id="call-status"></p>
<video id="localVideo" autoplay muted></video>
<video id="remoteVideo" autoplay></video><br>
<button id="accept-btn">Accept</button>
<button id="decline-btn">Decline</button>
<button id="end-btn">End Call</button>

<script src="/socket.io/socket.io.js"></script>
<script>
const socket = io();
const { id: USER_ID, name: USER_NAME } = window.USER;

let pc, localStream, currentPatientSocketId;

const acceptBtn = document.getElementById('accept-btn');
const declineBtn = document.getElementById('decline-btn');
const endBtn = document.getElementById('end-btn');
const callStatus = document.getElementById('call-status');
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

socket.on('connect', ()=> socket.emit('register-user',{ userId: USER_ID, name: USER_NAME, role:'doctor' }));

socket.on('incoming-request', data => {
  currentPatientSocketId = data.fromPatientId;
  callStatus.textContent = `${data.fromPatientName} wants to call you`;
});

acceptBtn.onclick = async () => {
  socket.emit('accept-request', { patientId: currentPatientSocketId });
  pc = new RTCPeerConnection({ iceServers:[{urls:'stun:stun.l.google.com:19302'}] });

  localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true});
  localVideo.srcObject = localStream;
  localStream.getTracks().forEach(t=>pc.addTrack(t,localStream));

  pc.ontrack = e => remoteVideo.srcObject = e.streams[0];
  pc.onicecandidate = e => { if(e.candidate) socket.emit('webrtc-ice',{toSocketId:currentPatientSocketId,candidate:e.candidate}); };

  callStatus.textContent='Call in progress...';
};

declineBtn.onclick = ()=>{ socket.emit('decline-request',{patientId:currentPatientSocketId}); callStatus.textContent='Call declined'; };

socket.on('webrtc-offer', async data => {
  if(!pc) pc = new RTCPeerConnection({ iceServers:[{urls:'stun:stun.l.google.com:19302'}] });
  pc.ontrack = e => remoteVideo.srcObject = e.streams[0];
  pc.onicecandidate = e => { if(e.candidate) socket.emit('webrtc-ice',{toSocketId:data.from,candidate:e.candidate}); };
  if(!localStream){ localStream = await navigator.mediaDevices.getUserMedia({video:true,audio:true}); localVideo.srcObject=localStream; localStream.getTracks().forEach(t=>pc.addTrack(t,localStream)); }
  await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  socket.emit('webrtc-answer',{toSocketId:data.from,sdp:answer});
});

socket.on('webrtc-ice', data => { if(pc && data.candidate) pc.addIceCandidate(new RTCIceCandidate(data.candidate)).catch(console.error); });
socket.on('session-ended', ()=>{ if(localStream)localStream.getTracks().forEach(t=>t.stop()); if(pc)pc.close(); localVideo.srcObject=null; remoteVideo.srcObject=null; callStatus.textContent=''; });

endBtn.onclick = ()=>{ socket.emit('end-session',{peerSocketId:currentPatientSocketId}); if(localStream)localStream.getTracks().forEach(t=>t.stop()); if(pc)pc.close(); localVideo.srcObject=null; remoteVideo.srcObject=null; callStatus.textContent=''; };
</script>
</body>
</html>
