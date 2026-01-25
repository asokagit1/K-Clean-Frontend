import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import './EditDataPetugas.css'; // Re-use existing CSS file since styles are identical

const EditDataUser = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Initialize state with data passed from Admin dashboard
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        no_telp: '',
        no_kk: '' // Specific field for User/Warga
    });

    useEffect(() => {
        if (location.state && location.state.user) {
            const user = location.state.user;
            setFormData({
                id: user.id,
                name: user.name || '',
                email: user.email || '',
                no_telp: user.phone || '',
                no_kk: user.no_kk || ''
            });
        }
    }, [location.state]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.patch(`/user/${formData.id}`, {
                name: formData.name,
                email: formData.email,
                no_telp: formData.no_telp,
                no_kk: formData.no_kk
            });

            // alert('Data Pengguna berhasil diperbaharui!');
            setShowSuccessModal(true);
            setTimeout(() => {
                navigate('/admin-dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Gagal memperbaharui data pengguna. ' + (error.response?.data?.message || 'Terjadi kesalahan.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-petugas-container">
            <div className="header-section">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ChevronLeft size={28} />
                </button>
                <h1 className="page-title">Edit Data Pengguna</h1>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Masukkan nama lengkap"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Nomor Kartu Keluarga (KK)</label>
                    <input
                        type="text"
                        name="no_kk"
                        className="form-input"
                        placeholder="Masukkan nomor KK"
                        value={formData.no_kk}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="Masukkan email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Nomor Telepon</label>
                    <input
                        type="tel"
                        name="no_telp"
                        className="form-input"
                        placeholder="Masukkan nomor telepon"
                        value={formData.no_telp}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Simpan'}
                    {!loading && <Check size={20} />}
                </button>
            </form>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="success-modal-overlay">
                    <div className="success-modal-content">
                        <div className="success-icon-container">
                            <Check size={40} color="#012E34" strokeWidth={3} />
                        </div>
                        <div className="success-text">Berhasil Diperbaharui</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditDataUser;
