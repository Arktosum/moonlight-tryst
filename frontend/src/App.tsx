import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./App.css";
import ImageUpload from "./ImageUpload";

// const ORIGIN = `https://moonlight-tryst-1.onrender.com/`;
const ORIGIN = `http://localhost:3000`;
const socket = io(ORIGIN);
type SocketMessage = {
  type: "MESSAGE" | "IMAGE";
  content: string;
  author: string;
  room: string;
};
function App() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<SocketMessage[]>([]);

  const sendMessage = () => {
    if (message == "") return;
    const messageItem: SocketMessage = {
      type: "MESSAGE",
      content: message,
      room: "room",
      author: socket.id ?? "",
    };
    socket.emit("send_message", messageItem);
    setMessageList((prev) => [...prev, messageItem]);
    setMessage("");
  };
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket with " + socket.id);
    });
    socket.emit("join_room", "room");
    socket.on("receive_message", (data) => {
      setMessageList((prev) => [...prev, data]);
    });
    return () => {
      socket.off("receive_message");
    };
  }, []);
  function readImageBuffer(imageBuffer: string | undefined) {
    if (!imageBuffer) return;
    const imageItem: SocketMessage = {
      type: "IMAGE",
      content: imageBuffer,
      room: "room",
      author: socket.id ?? "",
    };
    socket.emit("send_message", imageItem);
    setMessageList((prev) => [...prev, imageItem]);
  }
  return (
    <div className="h-screen w-screen bg-black flex flex-col">
      <div className="message-container w-full flex-1 overflow-auto flex gap-5 flex-col">
        {messageList.map((item) => {
          return <MessageItem key={Math.random() * 100000} item={item} />;
        })}
      </div>
      <div className="text-container flex">
        <input
          onKeyDown={(e) => {
            if (e.key != "Enter") return;
            sendMessage();
          }}
          value={message}
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          type="text"
          className="w-full px-5 py-2"
        />
        <button
          onClick={sendMessage}
          type="button"
          className="bg-gray-600 text-white px-5 py-2"
        >
          SEND
        </button>
        <ImageUpload readImageBuffer={readImageBuffer} />
      </div>
    </div>
  );
}

function MessageItem({ item }: { item: SocketMessage }) {
  const type = item.author == socket.id ? "SELF" : "OTHER";
  const alignment = type == "SELF" ? "justify-end" : "";
  const color = type == "SELF" ? "bg-blue-600" : "bg-gray-600";
  const img = new Image();
  img.src = item.content;
  let width = 0;
  let height = 0;
  img.onload = function () {
    width = img.width;
    height = img.height;
  };

  return (
    <div className={`flex ${alignment}`}>
      {item.type == "IMAGE" ? (
        <img src={item.content} alt="image" width={width} height={height}></img>
      ) : (
        <p className={`text-white py-2 px-5 ${color} rounded-xl`}>
          {item.content}
        </p>
      )}
    </div>
  );
}

export default App;
