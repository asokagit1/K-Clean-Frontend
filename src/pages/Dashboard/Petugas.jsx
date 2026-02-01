import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trash2, User, Coins, Home, Scan, Volume2, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Petugas.css';

const Petugas = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();

    // State for dashboard data
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Fetch Total Weight
                const weightRes = await api.get('/trash-weight-today');
                setTotalWeight(weightRes.data['Today Total Trash Weighted'] || 0);

                // Fetch Total Transactions
                const transactionRes = await api.get('/trash-transaction-total-today');
                setTotalTransactions(transactionRes.data['Today Total Transaction'] || 0);

                // Fetch Total Points
                const pointsRes = await api.get('/point-input-today');
                setTotalPoints(pointsRes.data['Today Total Point Inputted'] || 0);

                // Fetch Transaction History
                const historyRes = await api.get('/trash-transaction-history');
                setHistory(historyRes.data['Trash_Transaction'] || []);

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Helper to format number
    const formatNumber = (num) => {
        return new Intl.NumberFormat('id-ID').format(num);
    };

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1 className="app-title">K-CLEAN</h1>
            </header>

            <div className="greeting-container relative">
                <div className="greeting">Halo, selamat datang Petugas!</div>
                <button
                    className="absolute right-0 p-2 text-gray-500 hover:text-red-600 transition-colors"
                    onClick={handleLogout}
                    aria-label="Logout"
                >
                    <LogOut size={24} />
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {/* Total Card */}
                <div className="card card-total">
                    <div className="card-title">Total Berat</div>
                    <div className="icon-box yellow">
                        <Trash2 className="trash-bag-icon" fill="#4A4A4A" />
                    </div>
                    <div className="big-value">{loading ? '...' : `${formatNumber(totalWeight)} Kg`}</div>
                    <div className="sub-label">Hari ini</div>
                </div>

                {/* Total Transaksi */}
                <div className="card card-right">
                    <div className="card-title">Total Transaksi</div>
                    <div className="card-content-row">
                        <User className="icon-yellow" fill="#FFC400" />
                        <div className="card-value">{loading ? '...' : totalTransactions}</div>
                    </div>
                </div>

                {/* Poin Terkirim */}
                <div className="card card-right">
                    <div className="card-title">Poin Terkirim</div>
                    <div className="card-content-row">
                        <Coins className="icon-yellow" fill="#FFC400" />
                        <div className="card-value">{loading ? '...' : formatNumber(totalPoints)}</div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="history-section">
                <h3 className="history-title">Riwayat transaksi</h3>
                <div className="history-card">
                    {loading ? (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>
                    ) : history.length > 0 ? (
                        history.map((item) => (
                            <div key={item.trash_transaction_id} className="history-item">
                                <div className="item-left">
                                    <div className="trash-icon-circle">
                                        <Trash2 className="trash-icon-mini" />
                                    </div>
                                    <div className="item-text">
                                        {item.trash_type} <span className="item-weight">berat {item.trash_weight} kg</span>
                                    </div>
                                </div>
                                <Volume2 className="speaker-icon" />
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '20px', textAlign: 'center' }}>Tidak ada transaksi hari ini</div>
                    )}
                </div>
            </div>

            {/* Footer Info */}
            <div className="info-footer">
                fyi: Setiap 0,1 kg sampah Organik atau Anorganik setara dengan 1 poin eco.
            </div>

            {/* Bottom Navigation */}
            {/* Bottom Navigation */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
                <div onClick={() => navigate('/petugas-dashboard')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Home size={28} className="text-white" />
                        {isActive('/petugas-dashboard') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>

                <div onClick={() => navigate('/petugas-scan')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Scan size={28} className="text-white" />
                        {isActive('/petugas-scan') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>

                <div onClick={() => navigate('/petugas-profile')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <User size={28} className="text-white" />
                        {isActive('/petugas-profile') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Petugas;
