import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Appointment.css";
import Sidebar from "../components/Sidebar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";


const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const doctorRes = await axios.get(
          "http://localhost:5000/user/alldoctors",
          { withCredentials: true }
        );
        setDoctors(doctorRes.data);
        if (doctorRes.data.length > 0) setSelectedDoctor(doctorRes.data[0]);

        const apptRes = await axios.get(
          "http://localhost:5000/user/appointments",
          { withCredentials: true }
        );
        setAppointments(apptRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    setAvailableSlots([
      "12:00 PM",
      "12:30 PM",
      "1:00 PM",
      "1:30 PM",
      "2:00 PM",
    ]);
  }, [selectedDate]);

  const handleDateClick = (day) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const onSubmit = async (data) => {
    if (!selectedSlot || !selectedDoctor) return alert("Select doctor & time");

    try {
      await axios.post(
        "http://localhost:5000/user/Book",
        {
          doctor: selectedDoctor._id,
          date: selectedDate,
          time: selectedSlot,
          reason: data.reason,
        },
        { withCredentials: true }
      );
      alert("Appointment booked!");
      reset();
      setSelectedSlot(null);

      const apptRes = await axios.get(
        "http://localhost:5000/user/appointments",
        { withCredentials: true }
      );
      setAppointments(apptRes.data);
    } catch (err) {
      console.error(err);
      alert("Booking failed.");
    }
  };

  return (
    <div className="appointment">
      <div className="appointment-container">
        <div className="card">
          <h2>Select Doctor</h2>
          <select
            className="doctor-select"
            onChange={(e) => {
              const doctor = doctors.find((d) => d._id === e.target.value);
              setSelectedDoctor(doctor);
            }}
          >
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.fullname }
              </option>
            ))}
          </select>

          {selectedDoctor && (
            <div className="doctor-details">
              <p>
                <strong>Time:</strong> {"12:00 - 2:00"}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {"lorem ispum"}
              </p>
              <p className="rating">
                <strong>Rating:</strong> {"4.7"} ⭐
              </p>
            </div>
          )}
        </div>

      <div className="card calendar">
        <h3>Select Appointment Date</h3>
        <Calendar
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          minDate={new Date()}
        />
      </div>

        <div className="card">
          <h3>Available Time Slots</h3>
          <div className="slots">
            {availableSlots.map((slot) => (
              <button
                key={slot}
                className={`slot-button ${
                  selectedSlot === slot ? "selected" : ""
                }`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <textarea
              className="reason-textarea"
              placeholder="Reason for appointment..."
              {...register("reason", { required: true, maxLength: 300 })}
            ></textarea>
            <button className="book-button" type="submit">
              Book
            </button>
          </form>
        </div>

        <div className="card">
          <h3>Your Previous Appointments</h3>
          <ul className="appointments-list">
            {appointments.map((app) => (
              <li key={app._id} className="appointment-item">
                <span>
                  {new Date(app.date).toDateString()} at {app.time}
                </span>
                <span className="doctor">
                  Doctor:{" "}
                  {app.doctor?.fullname || app.doctor?.name || "Unknown"}
                </span>
                <span
                  className={`status ${app.status?.toLowerCase() || "pending"}`}
                >
                  {app.status || "pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
