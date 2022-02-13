const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const { Server } = require('socket.io');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`user with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data); // salje poruku samo onima koji su u istom roomu
    });

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
    });
});





server.listen(3001, () => {
    console.log('SERVER RUNNING ON PORT 30001');
});