import React, { useState } from 'react';
import { ChevronLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './CreatePetugas.css';

const CreatePetugas = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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
            // Note: Adjust the endpoint if it expects a specific body structure.
            // Assuming the simple POST endpoint creates the user with provided details.
            const response = await api.post('/createuser/petugas', formData);

            // alert('Petugas berhasil ditambahkan!'); // Removed alert
            setShowSuccessModal(true);
            setTimeout(() => {
                navigate('/admin-dashboard');
            }, 2000);
        } catch (error) {
            console.error('Error creating petugas:', error);
            alert('Gagal menambahkan petugas. ' + (error.response?.data?.message || 'Terjadi kesalahan.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-petugas-container">
            <div className="header-section">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ChevronLeft size={28} />
                </button>
                <h1 className="page-title">Tambah Petugas</h1>
            </div>

            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">Nama</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Masukkan nama petugas"
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
                        placeholder="Masukkan email petugas"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="password-input-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-input password-field"
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password-btn"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Menambahkan...' : 'Simpan'}
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
                        <div className="success-text">Berhasil Ditambahkan</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePetugas;
