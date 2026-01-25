import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/axios';
import './EditDataUMKM.css';

const EditDataUMKM = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Initialize state with data passed from Admin dashboard
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        no_telp: ''
    });

    useEffect(() => {
        if (location.state && location.state.user) {
            const user = location.state.user;
            setFormData({
                id: user.id,
                name: user.name || '',
                email: user.email || '',
                no_telp: user.phone || ''
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
                no_telp: formData.no_telp
            });

            // alert('Data UMKM berhasil diperbaharui!');
            setShowSuccessModal(true);
            setTimeout(() => {
                navigate('/admin-dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error updating UMKM:', error);
            alert('Gagal memperbaharui data UMKM. ' + (error.response?.data?.message || 'Terjadi kesalahan.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="edit-umkm-container">
            <div className="header-section">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ChevronLeft size={28} />
                </button>
                <h1 className="page-title">Edit Data UMKM</h1>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nama UMKM</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Masukkan nama UMKM"
                        value={formData.name}
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
                        placeholder="Masukkan email UMKM"
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

export default EditDataUMKM;
