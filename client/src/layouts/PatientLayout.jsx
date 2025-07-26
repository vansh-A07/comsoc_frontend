import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const PatientLayout = () => (
  <div style={{ display: 'flex' }}>
    <Sidebar />
    <div style={{ flex: 1 }}>
      <Outlet />
    </div>
  </div>
);

export default PatientLayout;
