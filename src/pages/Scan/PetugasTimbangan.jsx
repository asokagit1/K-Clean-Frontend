import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Home, Scan } from 'lucide-react';
import api from '../../api/axios';

const PetugasTimbangan = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get user data from navigation state (passed from PetugasScan)
    const { userData, scanResult } = location.state || {};

    const [trashType, setTrashType] = useState('Organik'); // Default to Organik
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);

    // Popup States
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    // Logic: 0.1 kg = 1 point => 1 kg = 10 points
    const estimatedPoints = weight ? Math.round(parseFloat(weight) * 10) : 0;

    // Redirect if direct access without scan
    if (!scanResult) {
        // Option: Redirect back to scan or show empty state
        // For development, we might settle for a warning or redirect.
        // navigate('/petugas-scan');
    }

    const isActive = (path) => location.pathname === path;

    const handleSubmit = async () => {
        if (!weight || parseFloat(weight) <= 0) {
            alert('Masukkan berat sampah yang valid');
            return;
        }

        setShowProcessModal(true); // Show processing
        setLoading(true);

        try {
            await api.post(
                `/trash-transaction/${scanResult}`,
                {
                    trash_type: trashType,
                    trash_weight: weight
                }
            );

            // Simulate processing delay for UX
            setTimeout(() => {
                setShowProcessModal(false);
                setShowSuccessModal(true);

                // Navigate after showing success
                setTimeout(() => {
                    navigate('/petugas-dashboard');
                }, 2000);
            }, 1500);

        } catch (error) {
            console.error("Error submitting transaction:", error);
            setShowProcessModal(false);
            alert('Transaksi Gagal: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-10 pb-24 relative font-sans">

            <h1 className="text-4xl font-black text-black mb-10 tracking-wide">K-CLEAN</h1>

            <div className="w-full max-w-xs px-4">
                <p className="text-black mb-2 font-medium">Kategori</p>
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setTrashType('Organik')}
                        className={`flex-1 py-3 rounded-lg font-bold transition-colors ${trashType === 'Organik'
                            ? 'bg-[#D6DCD9] text-[#012E34] border-2 border-[#012E34]/10'
                            : 'bg-[#E0E0E0] text-[#012E34] opacity-50'
                            }`}
                    >
                        Organik
                    </button>
                    <button
                        onClick={() => setTrashType('Anorganik')}
                        className={`flex-1 py-3 rounded-lg font-bold transition-colors ${trashType === 'Anorganik'
                            ? 'bg-[#D6DCD9] text-[#012E34] border-2 border-[#012E34]/10'
                            : 'bg-[#E0E0E0] text-[#012E34] opacity-50'
                            }`}
                    >
                        Anorganik
                    </button>
                </div>

                <div className="mb-8">
                    <label className="block text-2xl font-bold text-black mb-2 text-center">Berat:</label>
                    <div className="border border-black rounded-lg p-4 flex items-center justify-center bg-white h-24 relative">
                        <input
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full text-center text-5xl font-bold outline-none bg-transparent"
                            placeholder="0"
                        />
                        <span className="absolute right-6 text-2xl font-bold">Kg</span>
                    </div>
                </div>

                <div className="mb-12">
                    <label className="block text-2xl font-bold text-black mb-2 text-center">Point:</label>
                    <div className="border border-black rounded-lg p-4 flex items-center justify-center bg-white h-24 relative">
                        <span className="text-5xl font-bold">{estimatedPoints}</span>
                        <span className="absolute right-6 text-2xl font-bold">eco</span>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-4 bg-[#012E34] text-white rounded-lg font-bold text-lg hover:bg-[#012429] active:scale-[0.98] transition-all"
                >
                    {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
            </div>

            {/* Navbar */}
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
                        {/* Highlight Scan if we consider this part of scan flow, or maybe no highlight */}
                        <Scan size={28} className="text-white" />
                        {/* {isActive('/petugas-scan') && (
                             <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )} */}
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

            {/* Processing Modal */}
            {showProcessModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
                    <div className="bg-[#FFFFF0] rounded-3xl p-8 w-64 aspect-square flex flex-col items-center justify-center text-center shadow-xl animate-in fade-in zoom-in duration-200">
                        {/* Custom Coins Icon Placeholder - using SVG to mimic logic */}
                        <div className="w-20 h-20 mb-4 bg-transparent flex items-center justify-center relative">
                            {/* Stacked Coins Illustration using basic SVG shapes */}
                            <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                                <ellipse cx="50" cy="70" rx="30" ry="12" fill="#FFC107" stroke="#E65100" strokeWidth="3" />
                                <path d="M20 70v-15c0 6.6 13.4 12 30 12s30-5.4 30-12v15c0 6.6-13.4 12-30 12s-30-5.4-30-12z" fill="#FFB300" stroke="#E65100" strokeWidth="3" />

                                <ellipse cx="50" cy="55" rx="30" ry="12" fill="#FFC107" stroke="#E65100" strokeWidth="3" />
                                <path d="M20 55v-15c0 6.6 13.4 12 30 12s30-5.4 30-12v15c0 6.6-13.4 12-30 12s-30-5.4-30-12z" fill="#FFB300" stroke="#E65100" strokeWidth="3" />

                                <ellipse cx="50" cy="40" rx="30" ry="12" fill="#FFD54F" stroke="#E65100" strokeWidth="3" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#0D0D0D]">Sedang diproses...</h3>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center">
                    <div className="bg-[#FFFFF0] rounded-3xl p-8 w-64 aspect-square flex flex-col items-center justify-center text-center shadow-xl animate-in fade-in zoom-in duration-200">
                        <div className="w-20 h-20 mb-4 rounded-full border-[6px] border-[#012E34] flex items-center justify-center p-2">
                            <svg className="w-12 h-12 text-[#012E34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#0D0D0D]">Point terkirim</h3>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PetugasTimbangan;
