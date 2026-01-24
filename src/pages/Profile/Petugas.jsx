import React, { useState } from 'react';
import { ChevronLeft, Pencil, Home, Scan, User, Check, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Petugas.css';

const Petugas = () => {
    const navigate = useNavigate();

    // Mock data initial state
    const [userInfo, setUserInfo] = useState({
        name: 'Bob',
        email: 'bob23@gmail.com',
        phone: '085517234102',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Bob'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempUserInfo, setTempUserInfo] = useState(userInfo);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const handleInputChange = (field, value) => {
        setTempUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditClick = () => {
        setTempUserInfo(userInfo); // Reset temp to current actual info
        setIsEditing(true);
    };

    const handleSaveClick = () => {
        setShowSaveModal(true);
    };

    const handleDiscardClick = () => {
        setShowDiscardModal(true);
    };

    const confirmSave = () => {
        setUserInfo(tempUserInfo);
        setIsEditing(false);
        setShowSaveModal(false);
        // Additional API call logic here if needed
    };

    const confirmDiscard = () => {
        setTempUserInfo(userInfo); // Revert changes
        setIsEditing(false);
        setShowDiscardModal(false);
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ChevronLeft size={28} color="white" strokeWidth={3} />
                </button>
                <div className="header-title">K-CLEAN</div>
                <div style={{ width: 44 }}></div> {/* Spacer matching button width for true centering */}
            </div>

            {/* Avatar */}
            <div className="profile-avatar-section">
                <div className="avatar-wrapper">
                    <div className="avatar-circle">
                        <img src={tempUserInfo.avatarUrl} alt="Profile" className="avatar-img" />
                    </div>

                    {/* Floating Edit Button (View Mode) or Edit Icon (Edit Mode) */}

                    {isEditing && (
                        <div className="avatar-edit-overlay">
                            <Pencil size={20} color="white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Info Fields */}
            <div className="profile-form">
                <div className="form-group">
                    <label className="label">Nama Petugas</label>
                    {isEditing ? (
                        <input
                            type="text"
                            className="input-field"
                            value={tempUserInfo.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    ) : (
                        <div className="value-box">{userInfo.name}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            className="input-field"
                            value={tempUserInfo.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                    ) : (
                        <div className="value-box">{userInfo.email}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">Nomor Telepon</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            className="input-field"
                            value={tempUserInfo.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                    ) : (
                        <div className="value-box">{userInfo.phone}</div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            {isEditing ? (
                <div className="action-buttons">
                    <button className="save-button" onClick={handleSaveClick}>
                        Simpan
                    </button>
                    <button className="cancel-button" onClick={handleDiscardClick}>
                        Buang
                    </button>
                </div>
            ) : (
                <div className="edit-button-container">
                    <button className="edit-button" onClick={handleEditClick}>
                        Ubah
                        <Pencil className="edit-icon" />
                    </button>
                </div>
            )}

            {/* Save Confirmation Modal */}
            {showSaveModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon-container">
                            <Check size={80} color="#4CAF50" strokeWidth={3} />
                        </div>
                        <div className="modal-title text-green">Berhasil disimpan</div>
                        <div className="modal-subtitle">Data berhasil diperbaharui</div>
                        <button className="modal-button btn-green" onClick={confirmSave}>Lanjut</button>
                    </div>
                </div>
            )}

            {/* Discard Confirmation Modal */}
            {showDiscardModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon-container">
                            <div className="delete-circle-red">
                                <Trash2 size={32} color="white" />
                            </div>
                        </div>
                        <div className="modal-title text-red">Buang perubahan?</div>
                        <div className="modal-subtitle">Cek kembali data anda</div>
                        <button className="modal-button btn-red" onClick={confirmDiscard}>Buang</button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation (Reusing similar structure) */}
            <nav className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/petugas-dashboard')}>
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

export default Petugas;
