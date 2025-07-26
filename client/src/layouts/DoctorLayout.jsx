import DoctorSidebar from "../components/Doctorsidebar"
import { Outlet } from 'react-router-dom';

const DoctorLayout = () => (
  <div style={{ display: 'flex' }}>
    <DoctorSidebar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
  </div>
);

export default DoctorLayout;
