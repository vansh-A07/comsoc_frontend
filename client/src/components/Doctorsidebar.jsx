import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Sidebar.css';
import { getAuth } from '../utils/auth';

const DoctorSidebar = () => {
  const navigate = useNavigate();
  const user = getAuth();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/user/logout", { withCredentials: true });
      localStorage.clear()
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  const handleHome = () => {
    if (user) {
      navigate("/doctor");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="sidebar">
      <h2>{user.fullname}</h2>
      <ul>
        <li onClick={handleHome}>Home</li>
        <li onClick={() => navigate("/doctor/about")}>About Us</li>
        <li onClick={() => navigate("/doctor/chat")}>Chats</li>
        <li onClick={() => navigate("/doctor/appointment")}>Appointments</li>
        <li onClick={() => navigate("/doctor/review")}>Case Review</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default DoctorSidebar;
