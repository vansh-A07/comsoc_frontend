import "./index.css";
import Signin from "./pages/Signin";
import Login from "./pages/Login";
import Map from "./pages/Map";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RoleProtectedRoute from "./components/RoleProtectedroute";
import Appointment from "./pages/Appointment";
import ChatPage from "./pages/ChatPage";
import Order from "./pages/Order";
import DoctorAppointments from "./pages/DoctorAppointment";
import CaseReview from "./pages/CaseReview";
import DoctorLayout from "./layouts/DoctorLayout";
import PatientLayout from "./layouts/PatientLayout";
import About from "./pages/About";
import FirstAid from "./pages/FirstAid";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signin />} />
        <Route path="/map" element={<Map />} />
        <Route
          path="/patient"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <PatientLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<PatientDashboard />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="about" element={<About />} />
          <Route path="orders" element={<Order />} />
          <Route path="firstaid" element={<FirstAid />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:id" element={<ChatPage />} />
        </Route>

        <Route
          path="/doctor"
          element={
            <RoleProtectedRoute allowedRoles={["doctor"]}>
              <DoctorLayout />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="appointment" element={<DoctorAppointments />} />
          <Route path="review" element={<CaseReview />} />
          <Route path="about" element={<About />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="chat/:id" element={<ChatPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
