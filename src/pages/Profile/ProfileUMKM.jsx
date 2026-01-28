import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
                    avatar: null // Backend belum support kolom avatar di database
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
        setTempUser({...user}); // Reset temp ke data asli
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTempUser(prev => ({ ...prev, [name]: value }));
    };

    // --- 2. UPDATE DATA (UPDATE) ---
    const handleSaveClick = async () => {
        try {
            // Persiapkan Payload sesuai nama kolom di Controller
            const payload = {
                name: tempUser.name,
                email: tempUser.email,
                no_telp: tempUser.phone, // Kembalikan ke format backend: no_telp
                // avatar: ... (Skip dulu karena kolom DB tidak ada)
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
        setTempUser({...user}); 
        setIsEditing(false);
        setShowDiscardPopup(false);
    };

    if (loading) return <div className="profile-container" style={{textAlign:'center', paddingTop:'50px'}}>Loading Profile...</div>;

    return (
        <div className="profile-container">
            {/* HEADER */}
            <header className="profile-header">
                <button className="btn-back" onClick={() => navigate('/umkm-dashboard')}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <h1 className="header-title">K-CLEAN</h1>
            </header>

            {/* AVATAR SECTION */}
            <div className="avatar-section">
                <div className="avatar-circle">
                    {/* Gambar Dummy karena DB belum punya kolom avatar */}
                    <img 
                        src="https://img.freepik.com/free-vector/cute-boy-wearing-green-hat-cartoon-icon-illustration_138676-2795.jpg" 
                        alt="Profile" 
                        className="avatar-img" 
                    />
                </div>
                {isEditing && (
                    <div className="edit-avatar-btn" onClick={() => alert("Fitur upload foto belum tersedia di server saat ini.")}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </div>
                )}
            </div>

            {/* FORM INPUTS */}
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

            {/* ACTION BUTTONS */}
            <div className="action-buttons">
                {!isEditing ? (
                    <button className="btn-ubah" onClick={handleEditClick}>
                        Ubah 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                    </button>
                ) : (
                    <div className="edit-actions">
                        <button className="btn-simpan" onClick={handleSaveClick}>Simpan</button>
                        <button className="btn-buang" onClick={handleDiscardClick}>Buang</button>
                    </div>
                )}
            </div>

            {/* POP-UP 1: KONFIRMASI BUANG */}
            {showDiscardPopup && (
                <div className="popup-overlay">
                    <div className="popup-card">
                        <div className="popup-icon-red">
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#D32F2F" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
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
                            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                        </div>
                        <h3 className="popup-title green" style={{fontSize:'16px'}}>Berhasil disimpan</h3>
                        <p className="popup-desc">Data berhasil diperbaharui</p>
                        <button className="popup-btn-green" onClick={() => setShowSuccessPopup(false)}>Lanjut</button>
                    </div>
                </div>
            )}

            {/* BOTTOM NAV */}
            <nav className="bottom-nav">
                <div className="nav-item" onClick={() => navigate('/umkm-dashboard')}>
                     <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
                <div className="nav-item">
                     <svg viewBox="0 0 24 24"><path d="M5 5h2v2H5V5zm0 12h2v2H5v-2zm12 0h2v2h-2v-2zm0-12h2v2h-2V5zM3 3v6h6V3H3zm12 0v6h6V3h-6zM3 15v6h6v-6H3zm10 2h2v2h-2v-2zm2-4h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm0-2h2v2h-2v-2z"/></svg>
                </div>
                <div className="nav-item active">
                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
            </nav>
        </div>
    );
};

export default ProfileUMKM;