const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});


const users = {}; 

io.on('connection', (socket) => {
  console.log('A user connected with socket id:', socket.id);
  socket.on('register', (userId) => {
    users[userId] = socket.id; 
    console.log('User registered with id:', userId, 'and socket id:', socket.id);
  });

  socket.on('newMessage', ({ message, receiverId }) => {
    console.log('New message:', message, 'Receiver:', receiverId);

    const receiverSocketId = users[receiverId]; 
    console.log("Message passed to of id: " , receiverId , "and of socket id: " , receiverSocketId );

    if (receiverSocketId) {
        console.log("Message passed to of id: " , receiverId , "and of socket id: " , receiverSocketId );
      io.to(receiverSocketId).emit('newMessage', { 
        Message: message, 
        SenderId: socket.id, 
        createdAt: new Date()
      });
      console.log('Message sent to receiver with socket id:', receiverSocketId);
    } else {
      console.log('Receiver not connected.');
    }
  });


  socket.on('disconnect', () => {
    console.log('User disconnected');
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId]; 
        break;
      }
    }
  });
});

module.exports = { app, server, io };
