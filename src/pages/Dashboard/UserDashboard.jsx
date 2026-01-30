import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/ui/BottomNav';
import JadwalDrawer from '../../components/ui/JadwalDrawer';
import { Coins, CalendarClock, Repeat, Volume2, ChevronRight, History, LogOut } from 'lucide-react';
import api from '../../api/axios';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
    const { user, logout } = useAuth();
    const [isJadwalOpen, setIsJadwalOpen] = useState(false);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [points, setPoints] = useState(user?.points || 0); // Local state for live points
    const navigate = useNavigate();

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Notifications/History
                const historyResponse = await api.get('/notifications');
                if (historyResponse.data.status === 'success') {
                    setHistory(historyResponse.data.data);
                }

                // Fetch Fresh User Data (Points) - CONNECTED TO API
                const userResponse = await api.get('/user-data');
                // console.log("User Data Response:", userResponse.data); // Debugging
                if (userResponse.data && userResponse.data.Data) {
                    // Ensure we capture points, defaulting to 0 if null/undefined
                    const freshPoints = userResponse.data.Data.points || 0;
                    setPoints(freshPoints);
                }

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]); // Added navigate to dependency if needed, though usually stable

    const vouchers = [
        { id: 1, title: 'Coupon Discount', desc: 'All Item Sale 50% Off', image: 'https://placehold.co/300x120/E8DCCA/8B4513?text=Coupon+Discount' },
        { id: 2, title: 'Free Shipping', desc: 'Min. purchase 50k', image: 'https://placehold.co/300x120/D1E8E2/004D40?text=Free+Shipping' },
    ];

    return (
        <div className="min-h-screen bg-white flex justify-center font-sans text-gray-900">
            {/* Main Container */}
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col pb-24 px-6 md:border-x md:border-gray-100">

                {/* Header */}
                <div className="pt-8 pb-6 flex flex-col items-center relative">
                    <button
                        onClick={logout}
                        className="absolute right-0 top-8 p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Keluar"
                    >
                        <LogOut size={24} />
                    </button>

                    <h1 className="text-2xl font-black tracking-wider uppercase mb-6">K-CLEAN</h1>

                    <h2 className="text-lg font-bold mb-1">Sudah buang sampah hari ini ?</h2>
                </div>


                {/* Point Card */}
                <div className="w-full border-2 border-gray-800 rounded-xl p-6 mb-6 relative">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-extrabold text-lg">Point Anda</span>
                            <span className="text-xl">👉</span> {/* Using emoji as placeholder for the hand icon in design */}
                        </div>
                        <div className="text-4xl font-black text-secondary tracking-tight">
                            {points} eco
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setIsJadwalOpen(true)}
                        className="border-2 border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-primary mb-1">
                            <CalendarClock size={32} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-sm">Jadwal</span>
                    </button>

                    <button
                        onClick={() => navigate('/tukar-poin')}
                        className="border-2 border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-primary mb-1">
                            <Repeat size={32} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-sm">Tukar Poin</span>
                    </button>
                </div>

                {/* History Section */}
                <div className="mb-8">
                    <div className="border-2 border-gray-800 rounded-xl p-4 space-y-4">
                        {loading ? (
                            <div className="text-center py-4 text-gray-400">Loading...</div>
                        ) : (
                            history.length === 0 ? (
                                <div className="text-center py-6 text-gray-500 font-medium">
                                    <p>Belum ada riwayat transaksi</p>
                                    <p className="text-xs mt-1">Lakukan transaksi untuk melihat riwayat</p>
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                                <Coins size={16} className="text-secondary fill-secondary" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm leading-none mb-1">eco <span className="text-gray-500 font-normal text-xs">mendapatkan <span className="text-secondary font-bold">{item.points} poin eco</span></span></p>
                                            </div>
                                        </div>
                                        <button className="text-black">
                                            <Volume2 size={20} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {/* Voucher Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">Rekomendasi Voucher</h3>
                        <button
                            onClick={() => navigate('/tukar-poin')}
                            className="text-xs text-blue-500 hover:underline flex items-center"
                        >
                            Lihat semua <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="w-full rounded-xl overflow-hidden border border-gray-200">
                        <img src={vouchers[0].image} alt="Voucher" className="w-full h-auto object-cover" />
                    </div>
                </div>

            </div>

            {/* Bottom Nav */}
            <BottomNav />

            {/* Drawers */}
            <JadwalDrawer isOpen={isJadwalOpen} onClose={() => setIsJadwalOpen(false)} />
        </div>
    );
};

export default UserDashboard;
