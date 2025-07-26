import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import ChatList from "../components/ChatList";
import ChatWindow from "../components/ChatWindow";
import { getChatUsers } from "../services/Chatservice";
import socket from "../socket";
import axios from "axios";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/user/profile", { withCredentials: true })
      .then((res) => {
        if (res.data && res.data._id) {
          setCurrentUser(res.data);
          socket.emit("register", res.data._id);
        }
      })
      .catch((err) => console.error("Error fetching current user", err));
  }, []);

  useEffect(() => {
    getChatUsers()
      .then((res) => {
        const sanitized = res.data.map((user) => ({
          ...user,
          _id: user._id || user.id, 
        }));
        setUsers(sanitized);
      })
      .catch((err) => console.error("Error fetching chat users", err));
  }, []);

  useEffect(() => {
    if (!id || users.length === 0) return;

    const found = users.find((u) => String(u._id) === String(id));
    if (!found) return;

    setSelectedUser((prev) => {
      if (prev?._id === found._id) return prev;
      console.log("selected user:", found.fullname);
      return found;
    });
  }, [id, users]);

  if (!currentUser) return <div>Loading user...</div>;

  return (
    <div className="chat-layout">
      <div className="main-content">
        <div className="chat-container">
          <ChatList
            users={users}
            onSelectUser={(user) => setSelectedUser(user)}
            selectedUser={selectedUser}
          />
          {selectedUser ? (
            <ChatWindow
              selectedUser={selectedUser}
              currentUser={currentUser}
            />
          ) : (
            <div className="chat-placeholder">Select a user to start chatting</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
