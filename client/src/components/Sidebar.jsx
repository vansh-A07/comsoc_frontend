import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Sidebar.css';
import { getAuth } from '../utils/auth';

const Sidebar = () => {
  const navigate = useNavigate();
  const user=getAuth()
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
    
    
    if (user.role === "doctor") {
      navigate("/doctor");
    } else if (user.role === "patient") {
      navigate("/patient");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="sidebar">
      <h2>{user.fullname}</h2>
      <ul>
        <li onClick={()=>{
          handleHome()
        }}>Home</li>
        <li onClick={() => navigate("/patient/about")}>About Us</li>
        <li onClick={() => navigate("/patient/chat")
        }>Chats</li>
        <li onClick={() => navigate("/patient/Appointment")}>Appointments</li>
        <li onClick={() => navigate("/map")}>Map</li>
        <li onClick={() => navigate("/patient/orders")}>Order</li>
        <li onClick={() => navigate("/patient/firstaid")}>FirstAid Guide</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
