import React from 'react';
import { ChevronLeft, Pencil, Home, Scan, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ProfilePetugas.css';
import '../petugas/DashboardPetugas.css'; // Import shared nav styles if needed, or duplicate

const ProfilePetugas = () => {
    const navigate = useNavigate();

    // Mock data
    const user = {
        name: 'Bob',
        email: 'bob23@gmail.com',
        phone: '085517234102',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob' // Using dicebear for a cute avatar similar to design
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ChevronLeft size={28} strokeWidth={3} />
                </button>
                <div className="header-title">K-CLEAN</div>
                <div style={{ width: 44 }}></div> {/* Spacer matching button width for true centering */}
            </div>

            {/* Avatar */}
            <div className="profile-avatar-section">
                <div className="avatar-circle">
                    <img src={user.avatarUrl} alt="Profile" className="avatar-img" />
                </div>
            </div>

            {/* Info Fields */}
            <div className="profile-form">
                <div className="form-group">
                    <label className="label">Nama Petugas</label>
                    <div className="value-box">{user.name}</div>
                </div>

                <div className="form-group">
                    <label className="label">Email</label>
                    <div className="value-box">{user.email}</div>
                </div>

                <div className="form-group">
                    <label className="label">Nomor Telepon</label>
                    <div className="value-box">{user.phone}</div>
                </div>
            </div>

            {/* Edit Button */}
            <div className="edit-button-container">
                <button className="edit-button">
                    Ubah
                    <Pencil className="edit-icon" />
                </button>
            </div>

            {/* Bottom Navigation (Reusing similar structure) */}
            <nav className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/')}>
                    <Home className="nav-icon" />
                </div>
                <div className="nav-item">
                    <Scan className="nav-icon" />
                </div>
                <div className="nav-item" style={{ color: '#FFC400' }}> {/* Active state */}
                    <User className="nav-icon" />
                </div>
            </nav>
        </div>
    );
};

export default ProfilePetugas;
