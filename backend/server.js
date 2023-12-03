const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const port = 3001;
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());


// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle disconnection
  socket.on('send-message', (message) => {
    socket.broadcast.emit("receive-message", message);
  })
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
