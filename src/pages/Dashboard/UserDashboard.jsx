import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import BottomNav from '../../components/ui/BottomNav';
import JadwalDrawer from '../../components/ui/JadwalDrawer';
import { Coins, CalendarClock, Repeat, Volume2, ChevronRight, History, LogOut, TicketPercent } from 'lucide-react';
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
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">Riwayat Transaksi</h3>
                    </div>
                    <div className="border-2 border-gray-800 rounded-xl p-4 space-y-4 h-80 overflow-y-auto">
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
                                            {/* Icon based on transaction type */}
                                            <div className={cn(
                                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                                item.is_earning ? "bg-primary" : "bg-orange-100"
                                            )}>
                                                {item.is_earning ? (
                                                    <Coins size={16} className="text-secondary fill-secondary" />
                                                ) : (
                                                    <TicketPercent size={16} className="text-orange-600" />
                                                )}
                                            </div>
                                            
                                            <div>
                                                {item.is_earning ? (
                                                    <p className="font-bold text-sm leading-none mb-1">
                                                        eco <span className="text-gray-500 font-normal text-xs">mendapatkan <span className="text-secondary font-bold">{item.points} poin eco</span></span>
                                                    </p>
                                                ) : (
                                                     <p className="font-bold text-sm leading-none mb-1">
                                                        Tukar <span className="text-gray-500 font-normal text-xs">poin menjadi <span className="text-orange-600 font-bold">{item.description}</span></span>
                                                    </p>
                                                )}
                                                
                                                {/* Optional: Show negative points for spending */}
                                                {!item.is_earning && (
                                                    <p className="text-xs text-gray-400">-{item.points} poin</p>
                                                )}
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

                {/* "Tentang Kami" Carousel Section */}
                <div>
                     <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">Tentang Kami</h3>
                    </div>
                    
                    <div className="w-full rounded-xl overflow-hidden border border-gray-200 relative aspect-[2.5/1]">
                         {aboutUsImages.map((slide, index) => (
                             <img 
                                key={slide.id}
                                src={slide.image} 
                                alt="Tentang Kami" 
                                className={cn(
                                    "w-full h-full object-cover absolute top-0 left-0 transition-opacity duration-500",
                                    index === currentSlide ? "opacity-100" : "opacity-0"
                                )} 
                             />
                         ))}
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
