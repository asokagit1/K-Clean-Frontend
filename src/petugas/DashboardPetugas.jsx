import React from 'react';
import { Trash2, User, Coins, Home, Scan, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './DashboardPetugas.css';

const DashboardPetugas = () => {
    const navigate = useNavigate();

    // Mock data based on the design
    const transactions = [
        { type: 'Sampah Organik', weight: '5 kg', id: 1 },
        { type: 'Sampah Anorganik', weight: '15 kg', id: 2 },
        { type: 'Sampah Organik', weight: '5 kg', id: 3 },
        { type: 'Sampah Anorganik', weight: '10 kg', id: 4 },
        { type: 'Sampah Anorganik', weight: '10,5 kg', id: 5 },
        { type: 'Sampah Anorganik', weight: '15 kg', id: 6 },
    ];

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <h1 className="app-title">K-CLEAN</h1>
            </header>

            <div className="greeting">Halo, selamat datang pekerja!</div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {/* Total Card */}
                <div className="card card-total">
                    <div className="card-title">Total</div>
                    <div className="icon-box yellow">
                        {/* Custom Trash Bag Icon using simple shape or SVG if Lucide doesn't perfect match, 
                 but using Trash2 or similar for now, styled to look filled/bag-like */}
                        <Trash2 className="trash-bag-icon" fill="#4A4A4A" />
                    </div>
                    <div className="big-value">60 Kg</div>
                    <div className="sub-label">Hari ini</div>
                </div>

                {/* Total Transaksi */}
                <div className="card card-right">
                    <div className="card-title">Total Transaksi</div>
                    <div className="card-content-row">
                        <User className="icon-yellow" fill="#FFC400" />
                        <div className="card-value">30</div>
                    </div>
                </div>

                {/* Poin Terkirim */}
                <div className="card card-right">
                    <div className="card-title">Poin Terkirim</div>
                    <div className="card-content-row">
                        <Coins className="icon-yellow" fill="#FFC400" />
                        <div className="card-value">6.000</div>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="history-section">
                <h3 className="history-title">Riwayat transaksi</h3>
                <div className="history-card">
                    {transactions.map((item) => (
                        <div key={item.id} className="history-item">
                            <div className="item-left">
                                <div className="trash-icon-circle">
                                    <Trash2 className="trash-icon-mini" />
                                </div>
                                <div className="item-text">
                                    {item.type} <span className="item-weight">berat {item.weight}</span>
                                </div>
                            </div>
                            <Volume2 className="speaker-icon" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="info-footer">
                fyi: Setiap 0,01 kg sampah Organik atau Anorganik setara dengan 1 poin eco.
            </div>

            {/* Bottom Navigation */}
            <nav className="bottom-nav">
                <div className="nav-item">
                    <Home className="nav-icon" />
                </div>
                <div className="nav-item">
                    <Scan className="nav-icon" />
                </div>
                <div className="nav-item" onClick={() => navigate('/profile')}>
                    <User className="nav-icon" />
                </div>
            </nav>
        </div>
    );
};

export default DashboardPetugas;
