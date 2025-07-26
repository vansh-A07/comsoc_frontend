import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/DoctorAppointments.css";
import AppointmentsChart from "../components/AppointmentChart.jsx";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const statusOptions = ["pending", "confirmed", "cancelled", "completed"];

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/user/doctor/appointments", {
        withCredentials: true,
      });
      setAppointments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch appointments", err)
    }
  };

  const updateStatus = async (id, newStatus) => {
    setStatusUpdating(id);
    try {
      await axios.put(
        `http://localhost:5000/user/doctor/appointments/${id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((app) =>
          app._id === id ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setStatusUpdating(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge yellow";
      case "confirmed":
        return "status-badge green";
      case "cancelled":
        return "status-badge red";
      case "completed":
        return "status-badge blue";
      default:
        return "status-badge";
    }
  };

  return (
    <div className="doctor-appointments-page">
      <div className="appointments-main">
        <h2 className="title">📋 Your Appointments</h2>

        {!loading && appointments.length > 0 && (
          <div className="chart-wrapper">
            <AppointmentsChart data={appointments} />
          </div>
        )}

        {loading ? (
          <div className="loading">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <p className="no-appointments">No appointments found.</p>
        ) : (
          <div className="appointment-list">
            {appointments.map((app) => (
              <div key={app._id} className="appointment-card">
                <div className="card-header">
                  <h3>{app.patient?.fullname || "Unknown Patient"}</h3>
                  <span className={getStatusClass(app.status)}>{app.status}</span>
                </div>
                <p><strong>Date:</strong> {new Date(app.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {app.time}</p>
                <p><strong>Reason:</strong> {app.reason}</p>

                <div className="status-update">
                  <label htmlFor={`status-${app._id}`}>Update Status:</label>
                  <select
                    id={`status-${app._id}`}
                    value={app.status}
                    disabled={statusUpdating === app._id || ["cancelled", "completed"].includes(app.status)}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className={["cancelled", "completed"].includes(app.status) ? "locked-select" : ""}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {statusUpdating === app._id && <span className="updating">⏳ Updating...</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
