import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "../utils/auth";
import "../styles/Patientdashboard.css";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import profilepic from "../assets/profile.jpg";

const PatientDashboard = () => {
  const [User, setUser] = useState("");
  const [Appointment, setAppointment] = useState("");
  const [Order, setOrder] = useState("");
  const [chats, setChats] = useState([]);
  const [nearestHospital, setNearestHospital] = useState(null);

  const navigate = useNavigate();

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

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
  const storedHospital = localStorage.getItem("nearestHospital");
  if (storedHospital) {
    setNearestHospital(JSON.parse(storedHospital));
  }
}, []);

useEffect(() => {
  const user = getAuth();
  setUser(user);

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;

      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="hospital"](around:5000,${latitude},${longitude});
          node["healthcare"="hospital"](around:5000,${latitude},${longitude});
        );
        out body;
      `;

      const url =
        "https://overpass-api.de/api/interpreter?data=" +
        encodeURIComponent(overpassQuery);

      try {
        const res = await fetch(url);
        const data = await res.json();

        const sorted = data.elements
          .map((h) => ({
            name: h.tags?.name || "Unnamed Hospital",
            lat: h.lat,
            lon: h.lon,
            distance: getDistanceFromLatLonInKm(
              latitude,
              longitude,
              h.lat,
              h.lon
            ),
          }))
          .sort((a, b) => a.distance - b.distance);

        if (sorted.length > 0) {
          localStorage.setItem("nearestHospital", JSON.stringify(sorted[0]));
          setNearestHospital(sorted[0]);
        }
      } catch (err) {
        console.error("Failed to fetch hospital data", err);
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
    }
  );

  const appointment = async () => {
    try {
      const apptRes = await axios.get(
        "http://localhost:5000/user/appointments",
        { withCredentials: true }
      );

      const confirmedAppointments = apptRes.data.filter(
        (app) => app.status === "confirmed"
      );

      confirmedAppointments.sort((a, b) => new Date(a.date) - new Date(b.date));

      if (confirmedAppointments.length > 0) {
        setAppointment(confirmedAppointments[0]);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
    }
  };

  const order = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/my", {
        withCredentials: true,
      });
      if (res.data && res.data.length > 0) {
        setOrder(res.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch order", error);
    }
  };

  appointment();
  order();
  fetchChats();
}, []);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  console.log(Appointment, Order, chats);

  return (
    <div className="Patient-dashboard">
      <div className="dash-left">
        <div className="patient-info">
          <div className="info-left">
            <div className="img">
              <img src={profilepic} alt="profile" />
            </div>
          </div>
          <div className="info-right">
            <h2>{User.fullname}</h2>
            <p>age-{User.age}</p>
            <p>Blood group:{User.bloodgroup}</p>
          </div>
        </div>

        <div className="Appointments">
          <h3>Your Appointments</h3>

          {Appointment ? (
            <div className="app-list">
              <div className="app-date">
                <h3>{Appointment.time}</h3>
                <h3>{formatDate(Appointment.date)}</h3>
              </div>
              <div className="app-description">{Appointment.reason}</div>
            </div>
          ) : (
            <p>
             <i> No confirmed appointments found.</i>
            </p>
          )}

          <p
            id="view"
            onClick={() => navigate("/patient/Appointment")}
          >
            View more
          </p>
        </div>
        <div className="track-order">
          <h3>Your Recent Orders</h3>
          <div className="order-summary">
            {Order ? (
              <div className="order-item">
                <strong>Order ID: {Order._id.slice(-5).toUpperCase()}</strong>
                <br />
                Medicine:{" "}
                {Order.items.map((item, index) => (
                  <span key={item._id}>
                    {item.name} ({item.quantity})
                    {index < Order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
                <br />
                Status: {Order.status}
                <br />
                Date: {formatDate(Order.createdAt)}
              </div>
            ) : (
              <div className="order-item">No recent orders.</div>
            )}
          </div>

          <p onClick={() => navigate("/patient/orders")}>view more</p>
        </div>
      </div>

      <div className="dash-right">
        <div className="chats">
          <h3 >Your Chats</h3>
          {chats.map((chat) => (
            <div
              className="chat"
              key={chat._id}
              onClick={() => navigate(`/patient/chat/${chat._id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="chat-left">
                <img
                  src={profilepic}
                  alt="User"
                />
              </div>
              <div className="chat-right">
                <h4>{chat.fullname}</h4>
                <p>{chat.lastMessage || "No messages yet."}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="locate-doctors">
          <div className="hospital-card">
            <h3>🏥 Nearest Hospital</h3>
            {nearestHospital ? (
              <div className="hospital-info">
                <strong>{nearestHospital.name}</strong>
                <br />
                <small>
                  {nearestHospital.distance.toFixed(2)} km away
                  <br />({nearestHospital.lat.toFixed(4)},{" "}
                  {nearestHospital.lon.toFixed(4)})
                </small>
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
