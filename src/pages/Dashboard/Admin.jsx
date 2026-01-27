import React, { useState, useEffect } from 'react';
import { UserPlus, Store, X, Trash2, Check, LogOut } from 'lucide-react';
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
    const [isResetting, setIsResetting] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showSuccessDeleteModal, setShowSuccessDeleteModal] = useState(false);
    const [showSuccessResetModal, setShowSuccessResetModal] = useState(false);

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
                        phone: user.no_telp, // Map no_telp from API to phone
                        no_kk: user.no_kk, // Map no_kk from API
                        role: user.roles && user.roles.length > 0 ? user.roles[0].name : 'User', // roles is likely an array from Spatie
                        avatar: user.avatar
                            ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.avatar}`
                            : (user.profile_qr_path ? `http://localhost:8000/storage/${user.profile_qr_path}` : `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.name}`)
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
        setIsResetting(false);
        setNewPassword('');
    };

    const handleEditUser = () => {
        if (selectedUser.role.toLowerCase() === 'petugas') {
            navigate('/edit-data-petugas', { state: { user: selectedUser } });
        } else if (selectedUser.role.toLowerCase() === 'umkm') {
            navigate('/edit-data-umkm', { state: { user: selectedUser } });
        } else if (selectedUser.role.toLowerCase() === 'user') {
            navigate('/edit-data-user', { state: { user: selectedUser } });
        } else {
            alert(`Edit feature doesn't exist for role: ${selectedUser.role}`);
        }
    };

    const handleSavePassword = async () => {
        if (newPassword.length < 10) {
            alert('Password harus minimal 10 karakter.');
            return;
        }
        try {
            await api.patch(`/user/${selectedUser.id}`, { password: newPassword });
            // alert('Password berhasil direset!');
            setIsResetting(false);
            setNewPassword('');

            // Show success modal
            setShowSuccessResetModal(true);
            setTimeout(() => {
                setShowSuccessResetModal(false);
            }, 2000);

        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Gagal mereset password.');
        }
    };

    const handleDeleteUser = () => {
        // Show the delete confirmation modal
        setShowDeleteModal(true);
        // Hide the detail modal temporarily if needed, or keep it open in background? 
        // Based on design, it looks like a new popup. Let's keep detail modal open or close it?
        // Usually better to overlay on top or close the detail modal first.
        // Let's keep detail modal state but maybe hide it visually or just overlay the delete modal on top.
        // Actually, let's close the detail modal so the user focuses on deletion.
        setShowModal(false);
    };

    const confirmDeleteUser = async () => {
        try {
            await api.delete(`/user/${selectedUser.id}`);
            // alert('User berhasil dihapus');
            setUsers(users.filter(u => u.id !== selectedUser.id));
            setShowDeleteModal(false);

            // Show success modal
            setShowSuccessDeleteModal(true);
            setTimeout(() => {
                setShowSuccessDeleteModal(false);
                setSelectedUser(null);
            }, 2000);

        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Gagal menghapus user.');
            setShowDeleteModal(false);
        }
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        // Re-open detail modal? For now let's just go back to list
        setSelectedUser(null);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-container">
            {/* Header */}
            {/* Header */}
            <header className="admin-header">
                <div className="header-content">
                    <h1 className="app-title">K-CLEAN</h1>
                </div>
            </header>

            <div className="greeting-container relative">
                <div className="greeting">Halo, selamat datang Admin!</div>
                <button
                    className="absolute right-0 p-2 text-gray-500 hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <LogOut size={24} />
                </button>
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
                <div className="section-header">
                    <h3 className="section-title">Daftar Pengguna</h3>
                    <input
                        type="text"
                        placeholder="Cari email atau role..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="user-list">
                    {filteredUsers.map((user) => (
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

                            <div className="modal-details-grid">
                                {selectedUser.role.toLowerCase() === 'user' && (
                                    <>

                                        <div className="detail-item">
                                            <span className="detail-label">No KK: </span>
                                            <span className="detail-value">{selectedUser.no_kk}</span>
                                        </div>
                                    </>
                                )}

                                {selectedUser.role.toLowerCase() === 'petugas' && (
                                    <div className="detail-item">


                                    </div>
                                )}

                                {selectedUser.role.toLowerCase() === 'umkm' && (
                                    <div className="detail-item">

                                    </div>
                                )}

                                <div className="detail-item">
                                    <span className="detail-label">No Telepon: </span>
                                    <span className="detail-value">{selectedUser.phone}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email: </span>
                                    <span className="detail-value">{selectedUser.email}</span>
                                </div>
                                <div className="detail-item-column">
                                    <div className="detail-row">
                                        <span className="detail-label">Password: </span>
                                        <div className="password-display">
                                            <span className="detail-value">********</span>
                                            {!isResetting && <button className="btn-reset-password" onClick={() => setIsResetting(true)}>Reset</button>}
                                        </div>
                                    </div>
                                    {isResetting && (
                                        <div className="reset-password-container">
                                            <input
                                                type="text"
                                                className="reset-password-input"
                                                placeholder="Password baru (min 10 char)"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                            <div className="reset-actions">
                                                <button className="btn-save-password" onClick={handleSavePassword}>Simpan</button>
                                                <button className="btn-cancel-password" onClick={() => setIsResetting(false)}>Batal</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-edit" onClick={handleEditUser}>Edit</button>
                            <button className="btn-delete" onClick={handleDeleteUser}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay">
                    <div className="delete-modal-content">
                        <div className="delete-icon-container">
                            <div className="delete-icon-circle">
                                <Trash2 color="white" size={40} />
                            </div>
                        </div>
                        <h3 className="delete-title">Hapus Akun?</h3>
                        <p className="delete-subtitle">Cek Kembali Akun</p>

                        <div className="delete-actions-row">
                            <button className="btn-cancel-delete" onClick={cancelDelete}>Batal</button>
                            <button className="btn-confirm-delete" onClick={confirmDeleteUser}>Hapus</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Delete Modal */}
            {showSuccessDeleteModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content">
                        <div className="success-icon-container">
                            <Check size={40} color="#012E34" strokeWidth={3} />
                        </div>
                        <div className="success-text">Berhasil Dihapus</div>
                    </div>
                </div>
            )}

            {/* Success Reset Modal */}
            {showSuccessResetModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content">
                        <div className="success-icon-container">
                            <Check size={40} color="#012E34" strokeWidth={3} />
                        </div>
                        <div className="success-text">Berhasil Direset</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
