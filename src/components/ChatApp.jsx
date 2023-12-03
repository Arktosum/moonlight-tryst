import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const socket = io("http://localhost:3001");


  useEffect(() => {
    // Listen for incoming messages from the server
    socket.off().on("receive-message", (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });
  }, []); 


  const sendMessage = () => {
    // Emit a 'message' event to the server
    socket.emit("send-message", { user: "admin", message: inputMessage });
    // Clear the input field after sending a message
    setInputMessage("");
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.user}:</strong> {msg.message}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatApp;
