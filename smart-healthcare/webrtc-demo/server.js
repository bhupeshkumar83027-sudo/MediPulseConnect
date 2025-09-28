const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = 8080;

// Serve static files (HTML, CSS, JS)
app.use(express.static(__dirname + '/public'));

// Socket.IO signaling
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('webrtc-offer', (data) => {
        io.to(data.to).emit('webrtc-offer', { sdp: data.sdp, from: socket.id });
    });

    socket.on('webrtc-answer', (data) => {
        io.to(data.to).emit('webrtc-answer', { sdp: data.sdp, from: socket.id });
    });

    socket.on('webrtc-ice', (data) => {
        io.to(data.to).emit('webrtc-ice', { candidate: data.candidate });
    });

    // Simple patient/doctor registration
    socket.on('register-patient', (data) => { socket.join('patients'); console.log('Patient:', data); });
    socket.on('register-doctor', (data) => { socket.join('doctors'); console.log('Doctor:', data); });

    socket.on('request-doctor', (data) => {
        // Send request to a doctor (pick first doctor in room)
        const doctors = io.sockets.adapter.rooms.get('doctors');
        if (doctors && doctors.size > 0) {
            const doctorId = [...doctors][0]; // pick first doctor
            io.to(doctorId).emit('request-accepted', { doctorSocketId: doctorId });
        }
    });
});

server.listen(PORT, () => console.log(`Signaling server running on http://localhost:${PORT}`));
