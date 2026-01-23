import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const DashboardLayout = ({ title, role }) => {
    const { logout, user } = useAuth();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="mb-4">Welcome, {user?.name} ({role})</p>
            <Button onClick={logout} variant="outline">Logout</Button>
        </div>
    );
};

export const UserDashboard = () => <DashboardLayout title="Warga Dashboard" role="User" />;
export const DepoDashboard = () => <DashboardLayout title="Transfer Depo Dashboard" role="Petugas" />;
export const UmkmDashboard = () => <DashboardLayout title="UMKM Dashboard" role="UMKM" />;
export const AdminDashboard = () => <DashboardLayout title="Admin Dashboard" role="Super Admin" />;
