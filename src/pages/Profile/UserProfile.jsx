import React, { useState, useEffect } from 'react';
import { ChevronLeft, Pencil, Check, Trash2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BottomNav from '../../components/ui/BottomNav';
import './Petugas.css'; // Reusing the same styling

const UserProfile = () => {
    const navigate = useNavigate();

    // Initial state
    const [userInfo, setUserInfo] = useState({
        name: '',
        kk: '',
        email: '',
        phone: '',
        avatarUrl: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Default'
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user-data');
                const data = response.data.Data;
                setUserInfo({
                    name: data.name,
                    kk: data.no_kk || '',
                    email: data.email,
                    phone: data.no_telp || '',
                    avatar: data.avatar, // Store seed if available
                    avatarUrl: data.avatar
                        ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.avatar}`
                        : (data.profile_qr_path
                            ? `${import.meta.env.VITE_API_BASE_URL}/storage/${data.profile_qr_path}`
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
    const [showWarningModal, setShowWarningModal] = useState(false);

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
        if (!tempUserInfo.phone || tempUserInfo.phone.trim() === '') {
            setShowWarningModal(true);
            return;
        }

        try {
            await api.patch('/update-profile', {
                name: tempUserInfo.name,
                no_kk: tempUserInfo.kk || "", // Ensure string
                email: tempUserInfo.email || "", // Ensure string
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
                <button className="back-button" onClick={() => navigate('/dashboard')}>
                    <ChevronLeft size={28} color="white" strokeWidth={3} />
                </button>
                <div className="header-title">K-CLEAN</div>
                <button onClick={() => navigate('/QRprofileUser')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                    <QrCode size={32} color="black" />
                </button>
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
            <div className="profile-form" style={{ gap: '16px' }}>
                <div className="form-group">
                    <label className="label">Nama Keluarga</label>
                    {isEditing ? (
                        <input
                            type="text"
                            className="input-field"
                            value={tempUserInfo.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="-"
                        />
                    ) : (
                        <div className="value-text">{userInfo.name || '-'}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">Nomor KK</label>
                    {isEditing ? (
                        <div className="value-box" style={{ backgroundColor: '#f5f5f5', color: '#888' }}>
                            {userInfo.kk || '-'}
                        </div>
                    ) : (
                        <div className="value-text">{userInfo.kk || '-'}</div>
                    )}
                </div>

                <div className="form-group">
                    <label className="label">Email</label>
                    {isEditing ? (
                        <div className="value-box" style={{ backgroundColor: '#f5f5f5', color: '#888' }}>
                            {userInfo.email || '-'}
                        </div>
                    ) : (
                        <div className="value-text">{userInfo.email || '-'}</div>
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
                            placeholder="-"
                        />
                    ) : (
                        <div className="value-text">{userInfo.phone || '-'}</div>
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

            {/* Warning Modal */}
            {showWarningModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-icon-container">
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                border: '4px solid #FF5252',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <span style={{ color: '#FF5252', fontSize: '40px', fontWeight: 'bold' }}>!</span>
                            </div>
                        </div>
                        <div className="modal-title" style={{ color: '#000', marginTop: '15px' }}>Isi Nomor Telepon Terlebih Dahulu</div>
                        <button className="modal-button" style={{ backgroundColor: '#012E34', color: 'white', marginTop: '20px' }} onClick={() => setShowWarningModal(false)}>Oke</button>
                    </div>
                </div>
            )}

            {/* Bottom Navigation for User */}
            <BottomNav />
        </div>
    );
};

export default UserProfile;
