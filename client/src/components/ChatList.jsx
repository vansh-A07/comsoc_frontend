import React, { useEffect, useState } from "react";
import "../styles/ChatList.css";
import axios from "axios";
import profilePic from "../assets/profile.jpg"

const ChatList = ({ users, selectedUser, onSelectUser }) => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/chat/list", {
        withCredentials: true,
      });
      setChats(res.data);
    } catch (err) {
      console.error("Failed to load chats", err);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const mergedChatUsers = [
    ...chats,
    ...users.filter((user) => !chats.some((chat) => chat._id === user._id)),
  ];

  return (
    <div className="chat-list">
      <h3>All Chats</h3>
      {mergedChatUsers.length === 0 ? (
        <p>No users available to chat.</p>
      ) : (
        mergedChatUsers.map((user) => (
          <div
            key={user._id}
            className={`chat-list-item ${
              selectedUser?._id === user._id ? "selected" : ""
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="chat-avatar">
              <img
                src={profilePic}
                alt={user.fullname}
              />
            </div>
            <div className="chat-info">
              <h4>{user.fullname}</h4>
              <p>{user.lastMessage || "Start chatting..."}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};


export default ChatList;
