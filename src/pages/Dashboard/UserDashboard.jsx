import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/ui/BottomNav';
import JadwalDrawer from '../../components/ui/JadwalDrawer';
import { Coins, CalendarClock, Repeat, Volume2, ChevronRight, History, LogOut, TicketPercent, Store } from 'lucide-react';
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

    // Data Fetching Function
    const fetchData = async () => {
        try {
            // Fetch Fresh User Data (Points)
            const userResponse = await api.get('/user-data');
            if (userResponse.data && userResponse.data.Data) {
                setPoints(userResponse.data.Data.points);
            }

            // Fetch Notifications/History
            const historyResponse = await api.get('/notifications');
            if (historyResponse.data.status === 'success') {
                setHistory(historyResponse.data.data);
            }

        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch and Polling
    useEffect(() => {
        fetchData(); // Fetch immediately

        // Poll every 5 seconds for real-time updates
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [user]);

    // Carousel State
    const [currentSlide, setCurrentSlide] = useState(0);
    const aboutUsImages = [
        { id: 1, image: 'https://placehold.co/600x240/012E34/FFFFFF?text=Tentang+Kami+1' },
        { id: 2, image: 'https://placehold.co/600x240/4CAF50/FFFFFF?text=Tentang+Kami+2' },
        { id: 3, image: 'https://placehold.co/600x240/E53935/FFFFFF?text=Tentang+Kami+3' },
    ];

    // Carousel Auto-slide
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % aboutUsImages.length);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white flex justify-center font-sans text-gray-900">
            {/* Main Container */}
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col pb-24 px-6 md:border-x md:border-gray-100">

                {/* Header */}
                <div className="pt-8 pb-6 text-center">
                    <h1 className="text-2xl font-black tracking-wider uppercase">K-CLEAN</h1>
                </div>

                {/* Greeting & Logout */}
                <div className="relative mb-6">
                    <h2 className="text-lg font-bold pr-12">Sudah buang sampah hari ini ?</h2>
                    <button
                        onClick={logout}
                        className="absolute right-0 top-0 p-2 text-gray-500 hover:text-red-600 transition-colors"
                        title="Keluar"
                    >
                        <LogOut size={24} />
                    </button>
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
                        className="border-2 border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                        onClick={() => navigate('/tukar-poin')}
                    >
                        <div className="text-primary mb-1">
                            <Repeat size={32} strokeWidth={2.5} />
                        </div>
                        <span className="font-bold text-sm">Tukar Poin</span>
                    </button>
                </div>

                {/* History Section */}
                <h3 className="text-sm font-bold text-center mb-2 text-black">Riwayat Transaksi</h3>
                {/* Fixed height container for scrolling */}
                <div className="bg-white border border-black rounded-lg p-0 mb-6 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col h-[320px]">
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-4 text-xs text-gray-400">Loading...</div>
                        ) : (
                            history.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-xs">
                                    <p>Belum ada transaksi</p>
                                </div>
                            ) : (
                                history.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            {/* Icon based on transaction type */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                item.type === 'usage' ? "bg-blue-100" : (item.is_earning ? "bg-primary" : "bg-orange-100")
                                            )}>
                                                {item.type === 'usage' ? (
                                                    <Store size={14} className="text-blue-600" />
                                                ) : item.is_earning ? (
                                                    <Coins size={14} className="text-secondary fill-secondary" />
                                                ) : (
                                                    <TicketPercent size={14} className="text-orange-600" />
                                                )}
                                            </div>

                                            <div className="flex items-center text-xs w-full">
                                                {item.type === 'usage' ? (
                                                    <div className="flex items-center gap-1 w-full overflow-hidden">
                                                        <span className="font-bold text-black flex-shrink-0">Voucher</span>
                                                        <span className="text-gray-500 font-normal truncate">Digunakan: <span className="text-blue-600 font-bold">{item.description}</span></span>
                                                    </div>
                                                ) : item.is_earning ? (
                                                    <div className="flex items-center gap-1 w-full">
                                                        <span className="font-bold text-black flex-shrink-0">eco</span>
                                                        <span className="text-gray-500 font-normal truncate">mendapatkan</span>
                                                        <span className="text-secondary font-bold whitespace-nowrap">{item.points} poin eco</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1 w-full overflow-hidden">
                                                        <span className="font-bold text-black flex-shrink-0">Tukar</span>
                                                        <span className="text-gray-500 font-normal truncate">poin menjadi <span className="text-orange-600 font-bold">{item.description}</span></span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Volume2 size={18} className="text-black flex-shrink-0 ml-2" />
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>

                {/* "Tentang Kami" Carousel Section */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">Tentang Kami</h3>
                    </div>

                    <div className="w-full rounded-xl overflow-hidden border border-gray-200 relative aspect-[2.5/1] group">
                        {/* Slide Container */}
                        <div
                            className="flex transition-transform duration-500 ease-out h-full"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {aboutUsImages.map((slide) => (
                                <div key={slide.id} className="min-w-full h-full relative">
                                    <img
                                        src={slide.image}
                                        alt="Tentang Kami"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Navigation Dots */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {aboutUsImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-300 shadow-sm",
                                        index === currentSlide ? "bg-white w-6" : "bg-white/50 hover:bg-white/80"
                                    )}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
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
