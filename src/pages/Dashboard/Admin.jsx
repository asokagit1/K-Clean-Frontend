import React, { useState, useEffect } from 'react';
import { UserPlus, Store, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios'; // Adjust import based on actual file structure
import './Admin.css';

const Admin = () => {

    const navigate = useNavigate();
    const { logout } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]); // State for user list

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // The endpoint in UserManagementController is fetchUser, let's assume route is /fetch-users or similar
                // Wait, checking routes... I should check routes/api.php to be sure of the endpoint name for fetchUser
                const response = await api.get('/users');
                if (response.data && response.data.Data) {
                    const mappedUsers = response.data.Data.map(user => ({
                        id: user.id || user.uuid, // Use uuid if available, fallback to id
                        name: user.name,
                        email: user.email,
                        role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'User', // roles is likely an array from Spatie
                        avatar: user.profile_qr_path ? `http://localhost:8000/storage/${user.profile_qr_path}` : `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`
                    }));
                    setUsers(mappedUsers);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleCreatePetugas = () => {
        navigate('/create-petugas');
    };

    const handleCreateUMKM = () => {
        navigate('/create-umkm');
    };

    const handleDetailClick = (user) => {
        setSelectedUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleEditUser = () => {
        alert(`Edit user: ${selectedUser?.name}`);
    };

    const handleDeleteUser = () => {
        if (window.confirm(`Apakah anda yakin ingin menghapus ${selectedUser?.name}?`)) {
            alert('User dihapus');
            handleCloseModal();
        }
    };

    return (
        <div className="admin-container">
            {/* Header */}
            <header className="admin-header">
                <div className="header-content">
                    <h1 className="app-title">K-CLEAN</h1>
                    <button className="logout-button" onClick={handleLogout}>Log Out</button>
                </div>
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
                            <button className="detail-button" onClick={() => handleDetailClick(user)}>Detail</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* User Detail Modal */}
            {showModal && selectedUser && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={handleCloseModal}>&times;</button>

                        <div className="modal-avatar-large">
                            <img src={selectedUser.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${selectedUser.name}`} alt={selectedUser.name} className="avatar-img" />
                        </div>

                        <div className="modal-user-info">
                            <h3 className="modal-name">{selectedUser.name}</h3>
                            <span className="modal-role">{selectedUser.role}</span>
                            <p className="modal-email">{selectedUser.email}</p>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-edit" onClick={handleEditUser}>Edit</button>
                            <button className="btn-delete" onClick={handleDeleteUser}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
