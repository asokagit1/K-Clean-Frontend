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
import ListVoucher from './pages/Dashboard/ListVoucher';
import UserProfile from './pages/Profile/UserProfile';
import ProfileUMKM from './pages/Profile/ProfileUMKM';
import TukarPoin from './pages/Redeem/TukarPoin';
import DetailTukarPoin from './pages/Redeem/DetailTukarPoin';
import VoucherKu from './pages/QR/VoucherKu';
import QRprofileUser from './pages/QR/QRprofileUser';
import PetugasScan from './pages/Scan/PetugasScan';
import PetugasTimbangan from './pages/Scan/PetugasTimbangan';
import UmkmScan from './pages/Scan/UmkmScan';


const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user, isInitialized } = useAuth();

  // Wait for auth to initialize before checking token/roles
  if (!isInitialized) {
    return null; // Or a specific loading spinner
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect based on role if trying to access unauthorized page
    // or just send to their respective dashboard
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (user.role === 'petugas') return <Navigate to="/petugas-dashboard" replace />;
    if (user.role === 'umkm') return <Navigate to="/umkm-dashboard" replace />;
    if (user.role === 'user') return <Navigate to="/dashboard" replace />;

    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Public Route (redirect to dashboard if already logged in)
const PublicRoute = () => {
  const { token } = useAuth();
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

          {/* Protected Routes - All Authenticated Users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/email-verify" element={<EmailVerification />} />
          </Route>

          {/* ADMIN Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/create-petugas" element={<CreatePetugas />} />
            <Route path="/create-umkm" element={<CreateUMKM />} />
            <Route path="/edit-data-petugas" element={<EditDataPetugas />} />
            <Route path="/edit-data-umkm" element={<EditDataUMKM />} />
            <Route path="/edit-data-user" element={<EditDataUser />} />
          </Route>

          {/* PETUGAS Routes */}
          <Route element={<ProtectedRoute allowedRoles={['petugas']} />}>
            <Route path="/petugas-dashboard" element={<PetugasDashboard />} />
            <Route path="/petugas-profile" element={<PetugasProfile />} />
            <Route path="/petugas-scan" element={<PetugasScan />} />
            <Route path="/petugas-timbangan" element={<PetugasTimbangan />} />
          </Route>

          {/* UMKM Routes */}
          <Route element={<ProtectedRoute allowedRoles={['umkm']} />}>
            <Route path="/umkm-dashboard" element={<DashboardUMKM />} />
            <Route path="/create-voucher" element={<CreateVoucher />} />
            <Route path="/list-voucher" element={<ListVoucher />} />
            <Route path="/profile-umkm" element={<ProfileUMKM />} />
            <Route path="/umkm-scan" element={<UmkmScan />} />
          </Route>

          {/* USER Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/profile" element={<UserProfile />} />
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
