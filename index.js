import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

const port = process.env.PORT || 6001;

io.on('connection', (socket) => {
  console.log('a user connected.');
});

httpServer.listen(port, () => console.log(`Server is running at ${port}`));
