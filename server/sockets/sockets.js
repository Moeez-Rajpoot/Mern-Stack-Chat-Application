const Sockets = require('socket.io');
const http = require('http');
const express = require('express');

const app = express();
const server = http.createServer(app);
const io = Sockets(server);

io.on('connection', (socket) => {
    console.log('a user connected with socket id', socket.id);
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

module.exports = { app, server, io };