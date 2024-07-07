import { useEffect, useState } from "react";
import io from "socket.io-client";
// https://moonlight-tryst-1.onrender.com/

const socket = io.connect("https://moonlight-tryst-1.onrender.com/");

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<string[]>([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
      alert("Joined room :"+room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
    setMessageList((prev) => [...prev, message]);
    setMessage("");
  };

  useEffect(() => {
    socket.off().on("receive_message", (data) => {
      setMessageList((prev) => [...prev, data.message]);
    });
  }, [socket]);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        value={room}
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={joinRoom}> Join Room</button>
      <input
        value={message}
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      <h1> Messages : </h1>
      {messageList.map((item) => {
        return <div key={Math.random() * 100000}>{item}</div>;
      })}
    </div>
  );
}

export default App;
