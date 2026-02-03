import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User, Scan, Ticket, Volume2, LogOut, List } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Umkm.css';

const DashboardUMKM = () => {
    const [vouchers, setVouchers] = useState([]);
    const [activeCountApi, setActiveCountApi] = useState(0);
    const [totalUsed, setTotalUsed] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // Logout Handler
    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const fetchData = async () => {
            try {
                try {
                    const userRes = await api.get('/user-data');
                    setUser(userRes.data || {});
                } catch (userError) {
                    console.error("Gagal ambil data user:", userError);
                }

                const voucherRes = await api.get('/voucher');
                const voucherData = voucherRes.data.Vouchers || voucherRes.data.data || [];
                setVouchers(voucherData);

            } catch (error) {
                console.error("Gagal mengambil data:", error);
                setLoading(false);
            }
        };

        const fetchStats = async () => {
            try {
                const res = await api.get('/active-voucher');
                setActiveCountApi(res.data.Vouchers || 0);

                // Endpoint /voucher-used bermasalah (500), hitung manual dari history
                // karena history juga memfilter based on current month
                const historyRes = await api.get('/voucher-history');
                const historyData = historyRes.data['Voucher History'] || [];

                setTransactions(historyData);
                setTotalUsed(historyData.length);

            } catch (error) {
                console.error("Gagal ambil stats:", error);
            }
        };

        fetchData();
        fetchStats();
    }, []);

    // --- LOGIKA DATA ---
    const now = new Date();

    const activeVouchers = vouchers.filter(v => {
        const expDate = new Date(v.expired_at);
        return new Date(expDate) >= now;
    });

    const expiredVouchers = vouchers.filter(v => {
        const expDate = new Date(v.expired_at);
        return new Date(expDate) < now;
    });

    const activeCount = activeVouchers.length;
    const expiredCount = expiredVouchers.length;
    const totalCount = vouchers.length;

    const getWeeklyData = () => {
        const counts = [0, 0, 0, 0];
        const sortedVouchers = [...vouchers].sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        sortedVouchers.forEach(v => {
            const created = new Date(v.created_at);
            const diffTime = Math.abs(now - created);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 7) counts[3]++;
            else if (diffDays <= 14) counts[2]++;
            else if (diffDays <= 21) counts[1]++;
            else if (diffDays <= 28) counts[0]++;
        });
        return counts;
    };

    const weeklyStats = getWeeklyData();
    const maxWeekVal = Math.max(...weeklyStats, 1);

    const getTopVouchers = () => {
        const sortedBySales = [...vouchers].sort((a, b) => {
            const countA = a.user_voucher_count || 0;
            const countB = b.user_voucher_count || 0;
            return countB - countA;
        });
        return sortedBySales.slice(0, 5).map(v => ({
            name: v.title,
            val: v.user_voucher_count || 0
        }));
    };

    const topVouchers = getTopVouchers();
    const maxSalesVal = Math.max(...topVouchers.map(v => v.val), 1);

    // if (loading) return <div className="flex justify-center items-center h-screen">Loading Data...</div>;

    return (
        <div className="responsive-container relative">
            {/* HEADER (TANPA PROFILE) */}
            <header className="flex justify-center items-center py-6">
                <h1 className="text-2xl font-black tracking-widest text-black">K-CLEAN</h1>
            </header>

            <div className="relative mb-6 px-5">
                <h2 className="greeting pr-12">Selamat datang penjual!</h2>
                <button
                    className="absolute right-5 top-0 p-2 text-gray-500 hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <LogOut size={24} />
                </button>
            </div>

            <div className="dashboard-grid-new px-5 pb-24 font-['Inter']">
                {/* 1. Stats Row (3 Columns) */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-white border text-center border-black rounded-lg p-2 flex flex-col items-center justify-center h-32 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                        <div className="text-sm font-bold text-dark-blue mb-1">Aktif</div>
                        <div className="text-[#FFC400] mb-1">
                            <Ticket size={24} />
                        </div>
                        <div className="text-2xl font-black text-dark-blue mb-1">{activeCountApi}</div>
                        <div className="text-[10px] font-bold text-dark-blue">Saat ini</div>
                    </div>

                    <div className="bg-white border text-center border-black rounded-lg p-2 flex flex-col items-center justify-center h-32 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                        <div className="text-sm font-bold text-dark-blue mb-1">Kadaluarsa</div>
                        <div className="text-[#FFC400] mb-1">
                            {/* Percent icon style from image */}
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFC400"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                        </div>
                        <div className="text-2xl font-black text-dark-blue mb-1">{expiredCount}</div>
                        <div className="text-[10px] font-bold text-dark-blue">Saat ini</div>
                    </div>

                    <div className="bg-white border text-center border-black rounded-lg p-2 flex flex-col items-center justify-center h-32 shadow-[2px_2px_0px_rgba(0,0,0,0.1)]">
                        <div className="text-sm font-bold text-dark-blue mb-1">Total</div>
                        <div className="text-[#FFC400] mb-1">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h10" /></svg>
                        </div>
                        <div className="text-2xl font-black text-dark-blue mb-1">{totalUsed}</div>
                        <div className="text-[10px] font-bold text-dark-blue">Bulan ini</div>
                    </div>
                </div>

                {/* 2. Riwayat Transaksi */}
                <h3 className="text-sm font-bold text-center mb-2 text-black">Riwayat transaksi</h3>
                <div className="bg-white border border-black rounded-lg p-0 mb-6 shadow-[2px_2px_0px_rgba(0,0,0,0.1)] overflow-hidden">
                    <div className="flex flex-col">
                        {transactions.length > 0 ? transactions.map((t, i) => (
                            <div key={i} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    {/* Mock Food Icons */}
                                    <div className="w-8 h-8 rounded-full bg-yellow-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        <div className="text-[10px]">🍔</div>
                                    </div>
                                    <div className="flex items-center text-xs truncate">
                                        <span className="font-bold text-black mr-1">Voucher</span>
                                        {/* Updated mapping to correctly access nested voucher data */}
                                        <span className="font-normal text-black mr-1 truncate max-w-[80px]">{t.user_voucher?.voucher?.title || 'Unknown'}</span>
                                        <span className="font-bold text-[#FFC400]">Rp {t.user_voucher?.voucher?.discount_price ? new Intl.NumberFormat('id-ID').format(String(t.user_voucher.voucher.discount_price).replace(/\./g, '')) : '0'}</span>
                                    </div>
                                </div>
                                <Volume2 size={18} className="text-black flex-shrink-0 ml-2" />
                            </div>
                        )) : (
                            <div className="text-center text-xs text-gray-400 p-4">Belum ada transaksi</div>
                        )}
                    </div>
                </div>

                {/* 3. Top 5 Voucher - REMOVED per user request */}

                <div className="text-xs text-black font-medium leading-normal pr-12">
                    Jumlah voucher ditukarkan bertambah sebanyak {totalUsed} buah bulan ini.
                </div>
            </div>

            {/* FAB + Menu */}
            <div className={`fab-menu-container ${isMenuOpen ? 'open' : ''}`}>
                <button className="fab-menu-item" onClick={() => navigate('/list-voucher')}>
                    <List size={20} />
                    List Voucher
                </button>
                <button className="fab-menu-item" onClick={() => navigate('/create-voucher')}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="14" height="14" rx="2" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>
                    Buat Voucher
                </button>
            </div>

            <button
                className="fixed bottom-24 right-5 w-14 h-14 bg-[#FFC400] rounded-full flex items-center justify-center shadow-lg z-20 cursor-pointer hover:scale-105 transition-transform"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div className={`transform transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`}>
                    <span className="text-3xl text-white font-normal relative -top-[1px]">+</span>
                </div>
            </button>

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
        </div>
    );
};

export default DashboardUMKM;