import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import './Umkm.css';

const DashboardUMKM = () => {
    const [vouchers, setVouchers] = useState([]);
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    // STATE BARU UNTUK MENU FAB
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await api.get('/user');
                setUser(userRes.data);
                
                const voucherRes = await api.get('/voucher');
                setVouchers(voucherRes.data.Vouchers || []);
                
                setLoading(false);
            } catch (error) {
                console.error("Gagal mengambil data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper Statistik
    const activeCount = vouchers.filter(v => v.status === 'active').length;
    const expiredCount = vouchers.filter(v => v.status === 'expired').length;
    const totalCount = vouchers.length;

    // Dummy Data Top 5
    const topVouchers = [
        { name: 'Desert Box', val: 90 },
        { name: 'Takoyaki', val: 75 },
        { name: 'Donat', val: 60 },
        { name: 'Smoothies', val: 45 },
        { name: 'Kopi', val: 30 },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

    return (
        <div className="responsive-container relative">
            {/* --- HEADER --- */}
            <header className="header-section">
                <div className="header-left">
                    <div className="notif-icon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                            <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.36 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.63 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="black"/>
                            <circle cx="18" cy="6" r="3" fill="#FF5252"/>
                        </svg>
                    </div>
                    <h1 className="logo-text">K-CLEAN</h1>
                </div>

                <div className="user-profile-corner">
                    <div className="user-text">
                        <div className="user-name">{user.name}</div>
                        <div className="user-role">Mitra UMKM</div>
                    </div>
                    <div className="user-avatar">
                        <svg style={{width:'24px', height:'24px'}} viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                </div>
            </header>

            <h2 className="greeting">Hai, gimana penjualan hari ini?</h2>

            {/* --- DASHBOARD GRID --- */}
            <div className="dashboard-grid">
                
                {/* 1. Voucher Aktif */}
                <div className="stat-card-wrapper">
                    <div className="stat-card">
                        <div className="card-title">Voucher Aktif</div>
                        <div className="card-content-row">
                            <div className="icon-box-yellow">
                                <svg className="stat-icon" viewBox="0 0 24 24" fill="none" stroke="#FFC700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M19 5L5 19M5.5 5H5V5.5M18.5 19H19V18.5" /> 
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="#FFC700" fill="none" strokeWidth="2"/>
                                    <circle cx="9" cy="9" r="2" fill="#FFC700" />
                                    <circle cx="15" cy="15" r="2" fill="#FFC700" />
                                </svg>
                            </div>
                            <span className="big-number">{activeCount}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Voucher Kadaluarsa */}
                <div className="stat-card-wrapper">
                    <div className="stat-card">
                        <div className="card-title">Kadaluarsa</div>
                        <div className="card-content-row">
                            <div className="icon-box-yellow">
                                <svg className="stat-icon" viewBox="0 0 24 24" fill="#FFC700">
                                    <path d="M4 4h16v16H4z" opacity=".3"/>
                                    <path d="M19.5 3h-15C3.67 3 3 3.67 3 4.5v15c0 .83.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5v-15c0-.83-.67-1.5-1.5-1.5zM7.5 7.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S6 9.83 6 9s.67-1.5 1.5-1.5zm0 12c-2.49 0-4.5-2.01-4.5-4.5S5.01 10.5 7.5 10.5s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                </svg>
                            </div>
                            <span className="big-number">{expiredCount}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Total */}
                <div className="total-card-wrapper">
                    <div className="stat-card">
                        <div className="card-title">Total</div>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center'}}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="6" width="20" height="12" rx="2" fill="#FFCC80"/>
                                <path d="M6 6V18M18 6V18" stroke="#E65100" strokeWidth="2" strokeDasharray="2 2"/>
                                <text x="8" y="15" fill="#E65100" fontSize="8" fontWeight="bold">%</text>
                            </svg>
                            <span className="big-number" style={{marginTop:'5px'}}>{totalCount}</span>
                            <span className="sub-text">Bulan ini</span>
                        </div>
                    </div>
                </div>

                {/* 4. Chart */}
                <div className="chart-card-wrapper">
                    <div className="chart-card">
                        <div className="card-title">Voucher bulan ini</div>
                        <div className="simple-bar-chart">
                            <div className="bar-column"><div className="bar" style={{ height: '30%' }}></div><span className="bar-label">1</span></div>
                            <div className="bar-column"><div className="bar" style={{ height: '45%' }}></div><span className="bar-label">2</span></div>
                            <div className="bar-column"><div className="bar" style={{ height: '70%' }}></div><span className="bar-label">3</span></div>
                            <div className="bar-column"><div className="bar" style={{ height: '90%' }}></div><span className="bar-label">4</span></div>
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '11px', marginTop: '10px', color: '#666' }}>Minggu</div>
                    </div>
                </div>

                {/* 5. Top 5 List */}
                <div className="top-voucher-wrapper">
                    <div className="top-voucher-section">
                        <h3 className="section-title">Top 5 Voucher Terlaris</h3>
                        {topVouchers.map((item, index) => (
                            <div className="horizontal-chart-row" key={index}>
                                <div className="chart-label">{item.name}</div>
                                <div className="chart-bar-container">
                                    <div className="h-bar" style={{width: `${item.val}%`}}></div>
                                </div>
                            </div>
                        ))}
                         <div style={{display:'flex', justifyContent:'space-between', paddingLeft:'100px', fontSize:'10px', marginTop:'5px', color:'#888'}}>
                            <span>10</span><span>20</span><span>30</span><span>+</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* --- FLOATING ACTION BUTTON & MENU --- */}
            
            {/* Menu Drop-up (Hanya muncul jika isMenuOpen true) */}
            <div className={`fab-menu-container ${isMenuOpen ? 'open' : ''}`}>
                <button className="fab-menu-item" onClick={() => navigate('/create-voucher')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
                        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
                    </svg>
                    Buat Voucher
                </button>
                {/* Anda bisa menambahkan menu item lain di sini nanti */}
            </div>

            {/* Tombol Utama (+) */}
            <button 
                className={`fab-btn ${isMenuOpen ? 'open' : ''}`} 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {/* Gunakan span agar icon bisa diputar terpisah dari background tombol */}
                <span className="fab-icon">+</span>
            </button>


            {/* UNIVERSAL BOTTOM NAV */}
            <nav className="bottom-nav">
                <div className="nav-item active" onClick={() => navigate('/umkm-dashboard')}>
                     <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                </div>
                <div className="nav-item">
                     <svg viewBox="0 0 24 24"><path d="M5 5h2v2H5V5zm0 12h2v2H5v-2zm12 0h2v2h-2v-2zm0-12h2v2h-2V5zM3 3v6h6V3H3zm12 0v6h6V3h-6zM3 15v6h6v-6H3zm10 2h2v2h-2v-2zm2-4h2v2h-2v-2zm-2 0h2v2h-2v-2zm-2 2h2v2h-2v-2zm0-2h2v2h-2v-2z"/></svg>
                </div>
                <div className="nav-item">
                    <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
            </nav>
        </div>
    );
};

export default DashboardUMKM;