import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Scan } from 'lucide-react';
import api from '../../api/axios';
import './CreateVoucher.css';

const CreateVoucher = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // State Form
    const [nama, setNama] = useState('');
    const [alamat, setAlamat] = useState(''); // New State
    const [kategori, setKategori] = useState('');
    const [diskon, setDiskon] = useState(0);
    const [tanggal, setTanggal] = useState('');

    // State Jumlah Voucher (Default 1)
    const [jumlah, setJumlah] = useState(1);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // State Pop-up Notifikasi
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    // Handle File Upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    // Handle Submit Single Request
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!kategori || !diskon || !image) {
            alert("Mohon lengkapi semua data (Kategori, Diskon, dan Gambar wajib diisi)");
            return;
        }

        setLoading(true);
        const today = new Date().toISOString().split('T')[0];

        // Data Dasar
        const formData = new FormData();
        formData.append('title', nama);
        formData.append('points_required', diskon === 500 ? 50 : 100);
        formData.append('category', kategori);
        formData.append('voucher_image', image);
        formData.append('actives_at', today);
        formData.append('expired_at', tanggal);
        formData.append('umkm_address', alamat); // Add Address

        // New Fields
        formData.append('limit', jumlah); // Send amount as limit
        // Match backend enum format: "500" or "1.000"
        formData.append('discount_price', diskon === 1000 ? '1.000' : diskon.toString());

        try {
            // Single API Call
            await api.post('/voucher', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Tampilkan Pop-up Sukses
            setShowSuccessPopup(true);

            setTimeout(() => {
                setShowSuccessPopup(false);
                navigate('/umkm-dashboard');
            }, 1500);

        } catch (error) {
            console.error("Error creating voucher:", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Gagal: ${error.response.data.message}`);
            } else {
                alert('Gagal membuat voucher. Terjadi kesalahan pada server.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-voucher-container">
            {/* HEADER */}
            <header className="cv-header">
                <button className="btn-back" onClick={() => navigate(-1)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="cv-title">K-CLEAN</h1>
            </header>

            <h2 className="page-heading">Buat voucher</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" className="form-input" placeholder="Nama voucher" value={nama} onChange={(e) => setNama(e.target.value)} required />
                </div>

                {/* New Address Field */}
                <div className="form-group">
                    <input type="text" className="form-input" placeholder="Alamat UMKM" value={alamat} onChange={(e) => setAlamat(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label className="form-label">Kategori</label>
                    <div className="toggle-group">
                        <button type="button" className={`toggle-btn ${kategori === 'makanan' ? 'selected' : ''}`} onClick={() => setKategori('makanan')}>Makanan</button>
                        <button type="button" className={`toggle-btn ${kategori === 'minuman' ? 'selected' : ''}`} onClick={() => setKategori('minuman')}>Minuman</button>
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label">Jumlah diskon</label>
                    <div className="toggle-group">
                        <button type="button" className={`toggle-btn ${diskon === 500 ? 'selected' : ''}`} onClick={() => setDiskon(500)}>Rp 500</button>
                        <button type="button" className={`toggle-btn ${diskon === 1000 ? 'selected' : ''}`} onClick={() => setDiskon(1000)}>Rp 1.000</button>
                    </div>
                </div>

                <div className="form-group">
                    <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
                        {preview ? (<img src={preview} alt="Preview" className="file-preview" />) : (
                            <>
                                <div className="upload-icon-box">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                </div>
                                <div className="upload-title">Upload gambar voucher</div>
                                <div className="upload-desc">Maksimal ukuran file 2 Mb</div>
                                <button type="button" className="btn-pilih-file">Pilih File</button>
                            </>
                        )}
                        <input id="fileInput" type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </div>
                </div>

                {/* --- BAGIAN FORM TANGGAL (SUDAH DIPERBAIKI) --- */}
                <div className="form-group">
                    {/* LABEL DITAMBAHKAN DI SINI */}
                    <label className="form-label">Tanggal Kadaluarsa</label>

                    <div className="date-input-wrapper">
                        <input
                            type="date"
                            className="form-input"
                            value={tanggal}
                            onChange={(e) => setTanggal(e.target.value)}
                            required
                        />
                        <div className="date-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        </div>
                    </div>
                </div>

                {/* --- JUMLAH VOUCHER --- */}
                <div className="form-group">
                    <div className="qty-row-container">
                        <span className="qty-label-text">Jumlah Voucher</span>
                        <span className="qty-value-text">{jumlah}</span>
                        <div className="qty-controls">
                            <button type="button" className="qty-btn-square" onClick={() => setJumlah(Math.max(1, jumlah - 1))}>-</button>
                            <button type="button" className="qty-btn-square" onClick={() => setJumlah(jumlah + 1)}>+</button>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn-submit-create" disabled={loading}>
                    {loading ? `Memproses Voucher...` : 'Buat'}
                </button>
            </form>

            {/* Bottom Navigation */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
                <div onClick={() => navigate('/umkm-dashboard')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Home size={28} className="text-white" />
                        {isActive('/umkm-dashboard') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
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
                        {isActive('/profile-umkm') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>
            </div>

            {/* POP-UP NOTIFIKASI SUKSES */}
            {showSuccessPopup && (
                <div className="success-popup">
                    <div className="popup-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#003B46" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Voucher dibuat</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateVoucher;