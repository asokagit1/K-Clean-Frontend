import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Scan, Pencil, ChevronLeft } from 'lucide-react';
import api from '../../api/axios';
import './ProfileUMKM.css';

const ProfileUMKM = () => {
    const navigate = useNavigate();

    // --- STATE ---
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: null
    });

    const [isEditing, setIsEditing] = useState(false);
    const [tempUser, setTempUser] = useState({});
    const [loading, setLoading] = useState(true);

    // State Popups
    const [showDiscardPopup, setShowDiscardPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const avatarSeeds = [
        'Felix', 'Aneka', 'Zoe', 'Bob',
        'Jack', 'Ginger', 'Missy', 'Pumpkin'
    ];

    // --- 1. FETCH DATA (READ) ---
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Panggil endpoint fetchUserData
                const res = await api.get('/user-data');

                // Perhatikan struktur Controller: return response()->json(["Data"=> $userData]);
                // Maka kita ambil res.data.Data
                const backendData = res.data.Data || {};

                // Mapping Data Backend (no_telp) ke Frontend (phone)
                const userData = {
                    name: backendData.name || '',
                    email: backendData.email || '',
                    phone: backendData.no_telp || '', // Mapping kunci: no_telp -> phone
                    avatar: backendData.avatar, // Store seed if available
                    avatarUrl: backendData.avatar
                        ? `https://api.dicebear.com/9.x/avataaars/svg?seed=${backendData.avatar}`
                        : (backendData.profile_qr_path
                            ? `http://localhost:8000/storage/${backendData.profile_qr_path}`
                            : `https://api.dicebear.com/9.x/avataaars/svg?seed=${backendData.name}`)
                };

                setUser(userData);
                setTempUser(userData);
            } catch (err) {
                console.error("Gagal ambil profil:", err);
                // Jika error (misal token expired), redirect ke login bisa ditambahkan di sini
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // --- HANDLERS ---

    const handleEditClick = () => {
        setIsEditing(true);
        setTempUser({ ...user }); // Reset temp ke data asli
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUser(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarSelect = (seed) => {
        setTempUser(prev => ({
            ...prev,
            avatar: seed, // Store seed for backend
            avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`
        }));
        setShowAvatarModal(false);
    };

    // --- 2. UPDATE DATA (UPDATE) ---
    const handleSaveClick = async () => {
        try {
            // Persiapkan Payload sesuai nama kolom di Controller
            const payload = {
                name: tempUser.name,
                email: tempUser.email,
                no_telp: tempUser.phone, // Kembalikan ke format backend: no_telp
                avatar: tempUser.avatar // Send avatar seed
            };

            // Kirim request PATCH ke endpoint Update Profile
            await api.patch('/update-profile', payload);

            // Jika sukses:
            setUser(tempUser); // Update tampilan UI
            setIsEditing(false); // Keluar mode edit
            setShowSuccessPopup(true); // Tampilkan notif sukses

        } catch (error) {
            console.error("Gagal update profil:", error);
            if (error.response && error.response.data) {
                alert(`Gagal menyimpan: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Terjadi kesalahan saat menyimpan data.");
            }
        }
    };

    const handleDiscardClick = () => {
        setShowDiscardPopup(true);
    };

    const confirmDiscard = () => {
        setTempUser({ ...user });
        setIsEditing(false);
        setShowDiscardPopup(false);
    };

    // if (loading) return <div className="profile-container" style={{ textAlign: 'center', paddingTop: '50px' }}>Loading Profile...</div>;

    return (
        <div className="profile-container">
            {/* HEADER */}
            <div className="profile-header">
                <button className="btn-back" onClick={() => navigate('/umkm-dashboard')}>
                    <ChevronLeft size={28} color="white" strokeWidth={3} />
                </button>
                <div className="header-title">K-CLEAN</div>
                <div style={{ width: 44 }}></div> {/* Spacer for centering */}
            </div>

            {/* AVATAR SECTION */}
            <div className="avatar-section">
                <div className="avatar-circle">
                    <img
                        src={isEditing ? tempUser.avatarUrl : user.avatarUrl}
                        alt="Profile"
                        className="avatar-img"
                    />
                </div>
                {isEditing && (
                    <div className="edit-avatar-btn" onClick={() => setShowAvatarModal(true)}>
                        <Pencil size={20} color="white" />
                    </div>
                )}
            </div>

            {/* FORM INPUTS */}
            <div className="profile-form" style={{ gap: '0px' }}>
                <div className="form-container">
                    <div className="form-group">
                        <label className="form-label">Nama Penjual</label>
                        <input
                            type="text"
                            name="name"
                            className="profile-input"
                            value={isEditing ? tempUser.name : user.name}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="profile-input"
                            value={isEditing ? tempUser.email : user.email}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Nomor Telepon</label>
                        <input
                            type="text"
                            name="phone" // Frontend state pakai 'phone'
                            className="profile-input"
                            value={isEditing ? tempUser.phone : user.phone}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                        />
                    </div>
                </div>
            </div>

            {/* ACTION BUTTONS */}
            {isEditing ? (
                <div className="action-buttons">
                    <button className="btn-simpan" onClick={handleSaveClick}>Simpan</button>
                    <button className="btn-buang" onClick={handleDiscardClick}>Buang</button>
                </div>
            ) : (
                <div className="edit-button-container">
                    <button className="btn-ubah" onClick={handleEditClick}>
                        Ubah
                        <Pencil size={18} />
                    </button>
                </div>
            )}

            {/* POP-UP 1: KONFIRMASI BUANG */}
            {showDiscardPopup && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        <div className="popup-icon-red">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </div>
                        <h3 className="popup-title red">Buang perubahan?</h3>
                        <p className="popup-desc">Cek kembali data anda</p>
                        <button className="popup-btn-red" onClick={confirmDiscard}>Buang</button>
                    </div>
                </div>
            )}

            {/* POP-UP 2: BERHASIL DISIMPAN */}
            {showSuccessPopup && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        <div className="popup-icon-green">
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                        </div>
                        <h3 className="popup-title green" style={{ fontSize: '16px' }}>Berhasil disimpan</h3>
                        <p className="popup-desc">Data berhasil diperbaharui</p>
                        <button className="popup-btn-green" onClick={() => setShowSuccessPopup(false)}>Lanjut</button>
                    </div>
                </div>
            )}

            {/* Avatar Selection Modal */}
            {showAvatarModal && (
                <div className="popup-overlay" onClick={() => setShowAvatarModal(false)}>
                    <div className="popup-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '340px' }}>
                        <div style={{ marginBottom: 20, fontSize: '18px', fontWeight: 'bold' }}>Pilih Avatar</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                            {avatarSeeds.map(seed => (
                                <div
                                    key={seed}
                                    onClick={() => handleAvatarSelect(seed)}
                                    style={{
                                        cursor: 'pointer',
                                        border: tempUser.avatar === seed ? '3px solid #4CAF50' : '3px solid transparent',
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
                        <button className="popup-btn-red" onClick={() => setShowAvatarModal(false)}>Batal</button>
                    </div>
                </div>
            )}

            {/* BOTTOM NAV */}
            {/* Bottom Navigation */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
                <div onClick={() => navigate('/umkm-dashboard')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Home size={28} className="text-white" />
                    </div>
                </div>

                <div onClick={() => navigate('/umkm-scan')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Scan size={28} className="text-white" />
                    </div>
                </div>

                <div onClick={() => navigate('/profile-umkm')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <User size={28} className="text-white" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileUMKM;