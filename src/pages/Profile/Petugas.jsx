import React, { useState, useEffect } from 'react';
import { ChevronLeft, Pencil, Home, Scan, User, Check, Trash2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import './Petugas.css';

const Petugas = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // Initial state
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: '',
        avatarUrl: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user-data');
                const data = response.data.Data;
                setUserInfo({
                    name: data.name,
                    email: data.email,
                    phone: data.no_telp || '',
                    avatar: data.avatar, // Store seed if available
                    avatarUrl: data.avatar
                        ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.avatar}`
                        : (data.profile_qr_path
                            ? `http://localhost:8000/storage/${data.profile_qr_path}`
                            : `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.name}`)
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Sync tempUserInfo with userInfo when user data is fetched
    useEffect(() => {
        setTempUserInfo(userInfo);
    }, [userInfo]);

    const [isEditing, setIsEditing] = useState(false);
    const [tempUserInfo, setTempUserInfo] = useState(userInfo);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [showDiscardModal, setShowDiscardModal] = useState(false);

    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const avatarSeeds = [
        'Felix', 'Aneka', 'Zoe', 'Bob',
        'Jack', 'Ginger', 'Missy', 'Pumpkin'
    ];

    const handleInputChange = (field, value) => {
        setTempUserInfo(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAvatarSelect = (seed) => {
        setTempUserInfo(prev => ({
            ...prev,
            avatar: seed, // Store seed for backend
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`
        }));
        setShowAvatarModal(false);
    };

    const handleEditClick = () => {
        setTempUserInfo(userInfo); // Reset temp to current actual info
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            await api.patch('/update-profile', {
                name: tempUserInfo.name,
                email: tempUserInfo.email,
                no_telp: tempUserInfo.phone,
                avatar: tempUserInfo.avatar // Send avatar seed
            });

            // On success, update local state and show success modal
            setUserInfo(tempUserInfo);
            setIsEditing(false);
            setShowSaveModal(true);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Gagal memperbaharui profil. ' + (error.response?.data?.message || 'Terjadi kesalahan.'));
        }
    };

    const handleDiscardClick = () => {
        setShowDiscardModal(true);
    };

    const confirmSave = () => {
        // Just close the success modal
        setShowSaveModal(false);
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
                        <div className="avatar-edit-overlay" onClick={() => setShowAvatarModal(true)}>
                            <Pencil size={20} color="white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Info Fields */}
            <div className="profile-form" style={{ gap: '0px' }}>
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

            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="modal-overlay" onClick={() => setShowAvatarModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '340px' }}>
                        <div className="modal-title" style={{ marginBottom: 20 }}>Pilih Avatar</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                            {avatarSeeds.map(seed => (
                                <div
                                    key={seed}
                                    onClick={() => handleAvatarSelect(seed)}
                                    style={{
                                        cursor: 'pointer',
                                        border: tempUserInfo.avatar === seed ? '3px solid #4CAF50' : '3px solid transparent',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        width: '60px',
                                        height: '60px'
                                    }}
                                >
                                    <img
                                        src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`}
                                        alt={seed}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="modal-button btn-red" onClick={() => setShowAvatarModal(false)}>Batal</button>
                    </div>
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
            {/* Bottom Navigation */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
                <div onClick={() => navigate('/petugas-dashboard')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Home size={28} className="text-white" />
                        {isActive('/petugas-dashboard') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Scan size={28} className="text-white" />
                        {/* No active state for scan yet unless it's a route */}
                    </div>
                </div>

                <div onClick={() => navigate('/petugas-profile')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <User size={28} className="text-white" />
                        {isActive('/petugas-profile') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Petugas;
