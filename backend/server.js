const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config()
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI).then(()=>{
  console.log("Connected to MongoDB");
})

app.get('/',(req,res)=>{
  res.send("<h1>Welcome to the backend</h1>")
})
const messageSchema = new mongoose.Schema({
  message: String,
},{timestamps:true});
const Message = mongoose.model('Message', messageSchema);

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);
  socket.on("join_room", async (data) => {
    const messageItem = new Message({ message: "Joined room" });
    await messageItem.save();
    console.log("joined room",data);
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    const messageItem = new Message({ message: data.message });
    await messageItem.save();

    console.log("sending message",data);
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("SERVER IS RUNNING",3001);
});