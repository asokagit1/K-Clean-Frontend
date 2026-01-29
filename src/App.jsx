import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Onboarding from './pages/Auth/Onboarding';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import EmailVerification from './pages/Auth/EmailVerification';
import { UserDashboard } from './pages/Dashboard/Dashboards';
import AdminDashboard from './pages/Dashboard/Admin';
import PetugasDashboard from './pages/Dashboard/Petugas';
import PetugasProfile from './pages/Profile/Petugas';
import CreatePetugas from './pages/CreatePetugas&UMKM/CreatePetugas';
import CreateUMKM from './pages/CreatePetugas&UMKM/CreateUMKM';
import EditDataPetugas from './pages/EditPengguna/EditDataPetugas';
import EditDataUMKM from './pages/EditPengguna/EditDataUMKM';
import EditDataUser from './pages/EditPengguna/EditDataUser';
import DashboardUMKM from './pages/Dashboard/Umkm';
import CreateVoucher from './pages/Dashboard/CreateVoucher';
import UserProfile from './pages/Profile/UserProfile';
import ProfileUMKM from './pages/Profile/ProfileUMKM';
import TukarPoin from './pages/Redeem/TukarPoin';
import DetailTukarPoin from './pages/Redeem/DetailTukarPoin';
import VoucherKu from './pages/QR/VoucherKu';
import QRprofileUser from './pages/QR/QRprofileUser';

// Protected Route Component
const ProtectedRoute = () => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

// Public Route (redirect to dashboard if already logged in)
const PublicRoute = () => {
  const { token } = useAuth();
  // Ideally we should know which dashboard to redirect to, 
  // but for now let's just let the Login page handle standard redirection
  // or if we really want to prevent access to login when auth, we can implement that.
  // For simplicity, we allow access but Onboarding usually shouldn't show if logged in.
  return <Outlet />;
}


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/email-verify" element={<EmailVerification />} />
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/petugas-dashboard" element={<PetugasDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-petugas" element={<CreatePetugas />} />
            <Route path="/create-umkm" element={<CreateUMKM />} />
            <Route path="/petugas-profile" element={<PetugasProfile />} />
            <Route path="/edit-data-petugas" element={<EditDataPetugas />} />
            <Route path="/edit-data-umkm" element={<EditDataUMKM />} />
            <Route path="/edit-data-user" element={<EditDataUser />} />
            <Route path="/umkm-dashboard" element={<DashboardUMKM />} />
            <Route path="/create-voucher" element={<CreateVoucher />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/profile-umkm" element={<ProfileUMKM />} />
            <Route path="/tukar-poin" element={<TukarPoin />} />
            <Route path="/voucher/:id" element={<DetailTukarPoin />} />
            <Route path="/voucher-ku" element={<VoucherKu />} />
            <Route path="/QRprofileUser" element={<QRprofileUser />} />

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
