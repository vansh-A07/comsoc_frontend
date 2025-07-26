import React, { useEffect, useState } from "react";
import axios from "axios";
import socket from "../socket";
import "../styles/chatwindow.css";

const ChatWindow = ({ selectedUser, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!selectedUser?._id) return;

    axios
      .get(`http://localhost:5000/chat/messages/${selectedUser._id}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to fetch messages", err));
  }, [selectedUser?._id]);

  useEffect(() => {
    const handleReceive = (msg) => {
      const isRelevant =
        (msg.sender === selectedUser._id && msg.receiver === currentUser._id) ||
        (msg.receiver === selectedUser._id && msg.sender === currentUser._id);

      if (isRelevant) {
        setMessages((prev) => [...prev, msg]);
      }
    };
    
    socket.on("receive_message", handleReceive);
    return () => socket.off("receive_message", handleReceive);
  }, [selectedUser?._id, currentUser?._id]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message = {
      sender: currentUser._id,
      receiver: selectedUser._id,
      content: input,
    };

    socket.emit("send_message", message);
    setMessages((prev) => [...prev, { ...message, timestamp: new Date() }]);
    setInput("");
  };

  return (
    <div className="chat-window">
      <h3>Chat with {selectedUser.fullname}</h3>
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`message ${msg.sender === currentUser._id ? "sent" : "received"}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
