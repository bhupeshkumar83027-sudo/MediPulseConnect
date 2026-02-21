const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = 3000;

// Serve static files from current folder
app.use(express.static(__dirname));

// Store connected users
const users = {};

io.on('connection', socket => {
    console.log('User connected:', socket.id);

    // Register user (patient or doctor)
    socket.on('register', ({ role, name }) => {
        users[socket.id] = { role, name };
        console.log(`${role} registered: ${name} (${socket.id})`);
    });

    // Handle call request
    socket.on('call-user', ({ to, offer }) => {
        io.to(to).emit('call-made', { from: socket.id, offer });
    });

    // Handle answer
    socket.on('make-answer', ({ to, answer }) => {
        io.to(to).emit('answer-made', { from: socket.id, answer });
    });

    // Handle ICE candidates
    socket.on('ice-candidate', ({ to, candidate }) => {
        io.to(to).emit('ice-candidate', { from: socket.id, candidate });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        delete users[socket.id];
    });
});

http.listen(PORT, () => console.log(`Signaling server running on http://localhost:${PORT}`));
