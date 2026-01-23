import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPetugas from './petugas/DashboardPetugas';
import ProfilePetugas from './petugas/ProfilePetugas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="mobile-wrapper">
        <Routes>
          <Route path="/" element={<DashboardPetugas />} />
          <Route path="/profile" element={<ProfilePetugas />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
