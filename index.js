import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const port = process.env.PORT || 6001;

io.on('connection', (socket) => {
  console.log(socket.id);

  socket.on('send', (message, roomId) => socket.to(roomId).emit('receive', message));

  socket.on('join', async (roomId, cb) => {
    socket.join(roomId);
    const result = await io.in(roomId).fetchSockets();
    const userCount = result.length;
    socket.to(roomId).emit('countUser', userCount);
    cb(userCount);
    console.log(`${socket.id} joined room ${roomId}`);
  });

  socket.on('leave', async (roomId, cb) => {
    socket.leave(roomId);
    const result = await io.in(roomId).fetchSockets();
    const userCount = result.length;
    socket.to(roomId).emit('countUser', userCount);
    cb(userCount);
    console.log(`${socket.id} left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.id} is disconnected`);
  });
});

httpServer.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
