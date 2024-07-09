const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT
const mongoose = require("mongoose");

mongoose.connect(MONGODB_URI).then(()=>{
  console.log("Connected to MongoDB");
})
const messageSchema = new mongoose.Schema({
  message: String,
},{timestamps:true});


const imageSchema = new mongoose.Schema({
  image: String,
},{timestamps:true});

const Message = mongoose.model('Message', messageSchema);
const Image = mongoose.model('Image', imageSchema);

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get('/',(req,res)=>{
  res.send("<h1>Welcome to the backend</h1>")
})

io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", async (roomName) => {
    socket.join(roomName);
  });

  socket.on("send_message", async (data) => {
    if(data.type == 'MESSAGE'){
      const messageItem = new Message({ message: data.content });
      await messageItem.save();
    }
    else{
      const imageItem =  new Image({ image: data.content });
      await imageItem.save();
    }
    console.log("sending message",data);
    socket.to(data.room).emit("receive_message", data);
  });

});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
