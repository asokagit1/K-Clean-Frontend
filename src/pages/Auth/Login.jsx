import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';


const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const user = await login(formData.email, formData.password);
            
            // Role-based Redirection
            const roles = user.roles || []; // Assuming roles is an array
            if (roles.includes('super-admin')) {
                navigate('/admin-dashboard');
            } else if (roles.includes('petugas')) {
                navigate('/depo-dashboard'); // Transfer Depo
            } else if (roles.includes('umkm')) {
                navigate('/umkm-dashboard');
            } else {
                navigate('/dashboard'); // Warga (Default)
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Invalid Credentials');
        } 
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center p-6">
            <div className="w-full max-w-md space-y-8 mt-10">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold text-primary">K-CLEAN</h1>
                    
                    <div className="flex justify-center py-6">
                        <img src="/kclean-logo.png" alt="K-Clean Logo" className="w-40 h-40 object-contain" />
                    </div>

                    <h2 className="text-sm font-semibold text-primary">Selamat datang warga!</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Input 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input 
                        name="password"
                        type="password" 
                        placeholder="Password" 
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="pt-4">
                        <Button 
                            type="submit" 
                            className="w-full rounded-md bg-primary py-6"
                            isLoading={isLoading}
                        >
                            Masuk
                        </Button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Belum punya akun?{' '}
                    <Link to="/register" className="text-secondary font-bold hover:underline">
                        Daftar
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
