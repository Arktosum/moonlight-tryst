import { useEffect, useState } from "react";
import io from "socket.io-client";
// https://moonlight-tryst-1.onrender.com/

const socket = io("https://moonlight-tryst-1.onrender.com/");

function App() {
  //Room State
  // const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<string[]>([]);

  // const joinRoom = () => {
  //   if (room !== "") {
  //     socket.emit("join_room", room);
  //     alert("Joined room :"+room);
  //   }
  // };

  const sendMessage = () => {
    socket.emit("send_message", { message, room: "room" });
    setMessageList((prev) => [...prev, message]);
    setMessage("");
  };

  useEffect(() => {
    socket.emit("join_room", "room");
    socket.off().on("receive_message", (data: { message: string }) => {
      setMessageList((prev) => [...prev, data.message]);
    });
  }, [socket]);

  return (
    <div className="App">
      {/* <input
        placeholder="Room Number..."
        value={room}
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      /> */}
      {/* <button onClick={joinRoom}> Join Room</button> */}

      <h1>
        Hey Ananya, If you are still here, i love you. i will keep this website
        on forever. just type the message in the chat box and send it and i will
        get it!{" "}
      </h1>
      <p>Keep coming back to this website from time to time...</p>
      <p>
        Best thing to do is, send a message saying when you can talk to me and
        come here.. you bet i'll be here and we can talk!
      </p>
      <p>I will never forget you or ever leave you...</p>
      <h1> Messages : </h1>
      <input
        value={message}
        placeholder="Message..."
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}> Send Message</button>
      {messageList.map((item) => {
        return <div key={Math.random() * 100000}>{item}</div>;
      })}
    </div>
  );
}

export default App;
