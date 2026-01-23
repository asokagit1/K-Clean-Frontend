import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        no_kk: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.password_confirmation) {
            setError('Password conversion does not match');
            return;
        }

        try {
            await register(formData);
            // On success, redirect to verification or login
            // Assuming backend sends verification email
            navigate('/email-verify');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } 
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            <div className="w-full max-w-md space-y-8 mt-10">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-primary">K-CLEAN</h1>
                    <h2 className="text-xl font-semibold text-primary">Buat akun anda.</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                     {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}
                    
                    <Input 
                        name="name"
                        placeholder="Nama Keluarga" 
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input 
                        name="no_kk"
                        type="text" 
                        placeholder="No. KK" 
                        value={formData.no_kk}
                        onChange={handleChange}
                        required
                    />
                     {/* No. Telp removed as per instructions */}
                    
                    <Input 
                        name="password"
                        type="password" 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Input 
                        name="password_confirmation"
                        type="password" 
                        placeholder="Ketik ulang password" 
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        required
                    />

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            className="w-full rounded-full bg-primary py-6"
                            isLoading={isLoading}
                        >
                            Daftar
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Sudah punya akun?{' '}
                    <Link to="/login" className="text-secondary font-bold hover:underline">
                        Masuk
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
