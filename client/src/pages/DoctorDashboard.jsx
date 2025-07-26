import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "../utils/auth";
import "../styles/DoctorDashboard.css";
import { useNavigate } from "react-router-dom";
import doctorpic from "../assets/doctor.jpg";
import profilepic from "../assets/profile.jpg";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState("");
  const [appointment, setAppointment] = useState(null);
  const [appointments, setAppointments] = useState([]); 
  const [stats, setStats] = useState({
    today: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
  });
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getAuth();
    setDoctor(user);

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/user/doctor/appointments",
          {
            withCredentials: true,
          }
        );

        const all = res.data || [];
        setAppointments(all);

        const confirmed = all.filter((app) => app.status === "confirmed");
        confirmed.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (confirmed.length > 0) {
          setAppointment(confirmed[0]);
        }

        const todayDate = new Date().toISOString().split("T")[0];
        const today = all.filter((app) =>
          app.date.startsWith(todayDate)
        ).length;
        const pending = all.filter((app) => app.status === "pending").length;
        const cancelled = all.filter(
          (app) => app.status === "cancelled"
        ).length;

        setStats({
          today,
          confirmed: confirmed.length,
          pending,
          cancelled,
        });
      } catch (error) {
        console.error("Error fetching doctor appointments:", error);
      }
    };

    const fetchChats = async () => {
      const res = await axios.get("http://localhost:5000/chat/list", {
        withCredentials: true,
      });
      setChats(res.data);
    };

    fetchAppointments();
    fetchChats();
  }, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="Doctor-dashboard">
      <div className="doctor-left">
        <div className="doctor-info">
          <div className="img-section">
            <div className="img">
              <img src={doctorpic} alt="doctor" />
            </div>
          </div>
          <div className="info-section">
            <h2>{doctor.fullname}</h2>
            <p>Specialization: {doctor.specialization || "General"}</p>
            <p>Age: {doctor.age}</p>
          </div>
        </div>
        <div className="appointment-section">
          <h3>Upcoming Appointments</h3>
          {appointment ? (
            <div className="appointment-card" key={appointment._id}>
              <div>
                <strong>{appointment.patient.fullname || "Patient"}</strong>
                <p>
                  {formatDate(appointment.date)} at {appointment.time}
                </p>
              </div>
              <div>{appointment.reason}</div>
            </div>
          ) : (
            <p
              style={{ color: "#999", fontStyle: "italic", marginTop: "20px" }}
            >
              No appointments found.
            </p>
          )}
          <p
            className="view-link"
            onClick={() => navigate("/doctor/Appointment")}
          >
            View more
          </p>
        </div>
        <div className="pending-reports-card">
          <h4>📄 Pending Reports</h4>
          <p>
            <strong>3</strong> reports awaiting review
          </p>
          <p className="view" onClick={() => navigate("/doctor/review")}>
            View more
          </p>
        </div>
      </div>

      <div className="doctor-right">
        <div className="chat-section">
          <h3>Chats</h3>
          {chats.map((chat) => (
            <div
              className="chat"
              key={chat._id}
              onClick={() => navigate(`/doctor/chat/${chat._id}`)}
            >
              <div className="chat-left">
                <img
                  src={profilepic}
                  alt="user"
                />
              </div>
              <div className="chat-right">
                <h4>{chat.fullname}</h4>
                <p>{chat.lastMessage || "No messages yet."}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="analytics-card">
          <div className="analytics-header">
            <h3>📊 Appointment Overview</h3>
            <p className="card-subtitle">Real-time snapshot of your schedule</p>
          </div>

          <div className="analytics-stats">
            <div className="stat stat-today">
              <h4>📆 Today</h4>
              <p className="stat-number">{stats.today}</p>
              <span className="stat-desc">Scheduled for today</span>
            </div>

            <div className="stat stat-confirmed">
              <h4>✅ Confirmed</h4>
              <p className="stat-number">{stats.confirmed}</p>
              <span className="stat-desc">Approved and upcoming</span>
            </div>

            <div className="stat stat-pending">
              <h4>⏳ Pending</h4>
              <p className="stat-number">{stats.pending}</p>
              <span className="stat-desc">Awaiting confirmation</span>
            </div>

            <div className="stat stat-cancelled">
              <h4>❌ Cancelled</h4>
              <p className="stat-number">{stats.cancelled}</p>
              <span className="stat-desc">Cancelled by patient/you</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
