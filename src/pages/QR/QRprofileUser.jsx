import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BottomNav from '../../components/ui/BottomNav';

import '../Profile/Petugas.css';

const QRprofileUser = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/user-data');
                if (response.data && response.data.Data) {
                    setUserData(response.data.Data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Helper to get Avatar URL
    const getAvatarUrl = (data) => {
        if (!data) return '';
        if (data.avatar && !data.avatar.includes('http')) {
            return `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.avatar}`;
        }
        return data.avatar || `https://api.dicebear.com/9.x/avataaars/svg?seed=${data.name}`;
    };

    // Helper to get QR URL
    const getQrUrl = (data) => {
        // Prefer transaction QR for operations, fall back to profile QR
        if (data?.transaction_qr_path) {
            return `${import.meta.env.VITE_API_BASE_URL}/public/storage/trash_transaction_qr/users/${data.transaction_qr_path}`;
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-[#E8EBF2] flex justify-center font-sans overflow-hidden">
            {/* Background decoration (Abstract curves simulation) */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full border-[40px] border-[#CED4E0]/50 transform rotate-45"></div>
                <div className="absolute top-[20%] right-[-20%] w-[400px] h-[400px] rounded-full border-[60px] border-[#CED4E0]/50"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[300px] h-[300px] rounded-full border-[40px] border-[#CED4E0]/50"></div>
            </div>

            <div className="w-full max-w-md bg-transparent min-h-screen relative flex flex-col pb-24 z-10">

                {/* Header */}
                <div className="px-6 pt-8 pb-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="back-button"
                    >
                        <ChevronLeft size={28} color="white" strokeWidth={3} />
                    </button>

                </div>

                {/* Content Card */}
                <div className="flex-1 flex flex-col items-center justify-center px-8">

                    <div className="bg-white rounded-3xl p-6 w-full shadow-lg flex flex-col items-center relative">
                        {/* Avatar (Floating top center) */}
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                            <div className="w-32 h-32 rounded-full bg-[#F0F0F0] p-1 shadow-md">
                                <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                    {userData ? (
                                        <img src={getAvatarUrl(userData)} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Spacer for avatar */}
                        <div className="h-16 w-full"></div>

                        {/* User Info */}
                        <h2 className="text-xl font-black text-[#012E34] mt-2 mb-1">
                            {userData ? `@${userData.name.split(' ')[0]}` : '...'}
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mb-6">Scan QR pada tempat terang</p>

                        {/* QR Code */}
                        <div className="border border-gray-200 rounded-xl p-4 w-full aspect-square flex items-center justify-center bg-white shadow-sm">
                            {loading ? (
                                <div className="text-gray-400">Loading QR...</div>
                            ) : (
                                userData && getQrUrl(userData) ? (
                                    <img src={getQrUrl(userData)} alt="User QR" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-gray-400 text-center text-sm">QR Code belum tersedia.<br />Silakan regenerate di profil.</div>
                                )
                            )}
                        </div>

                    </div>
                </div>

            </div>

            <BottomNav />
        </div>
    );
};

export default QRprofileUser;
