import React from 'react';
import { UserPlus, Store, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // Adjust import based on actual file structure
import './Admin.css';

const Admin = () => {

    const navigate = useNavigate();

    const handleCreatePetugas = () => {
        navigate('/create-petugas');
    };

    const handleCreateUMKM = async () => {
        try {
            const response = await api.post('/createuser/umkm');
            alert('UMKM berhasil ditambahkan!');
            console.log('Success:', response.data);
        } catch (error) {
            console.error('Error creating UMKM:', error);
            alert('Gagal menambahkan UMKM.');
        }
    };

    // Mock Data for User List
    const users = [
        { id: 1, email: 'Budi123@gmail.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Budi' },
        { id: 2, email: 'Petugas1@gmail.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Petugas1' },
        { id: 3, email: 'Umkmjus@gmail.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Umkm' },
        { id: 4, email: 'Adi123@gmail.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Adi' },
    ];

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <h1 className="app-title">K-CLEAN</h1>
            </header>

            <div className="greeting-section">
                <h2 className="greeting-text">Halo, selamat datang Admin!</h2>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons-grid">
                <button className="action-card" onClick={handleCreatePetugas}>
                    <UserPlus className="action-icon" />
                    <span className="action-label">Tambah<br />Petugas</span>
                </button>

                <button className="action-card" onClick={handleCreateUMKM}>
                    <Store className="action-icon" />
                    <span className="action-label">Tambah<br />UMKM</span>
                </button>
            </div>

            {/* User List */}
            <div className="user-list-section">
                <h3 className="section-title">Daftar Pengguna</h3>
                <div className="user-list">
                    {users.map((user) => (
                        <div key={user.id} className="user-card">
                            <div className="user-info">
                                <div className="user-avatar">
                                    <img src={user.avatar} alt="Avatar" className="avatar-img" />
                                </div>
                                <span className="user-email">{user.email}</span>
                            </div>
                            <button className="detail-button">Detail</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Admin;
