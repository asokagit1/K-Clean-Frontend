import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, MapPin } from 'lucide-react';
import api from '../../api/axios';
import BottomNav from '../../components/ui/BottomNav';

import '../Profile/Petugas.css';

const VoucherKu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // State
    const [activeVouchers, setActiveVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Fetch and Merge Data
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                // 1. Fetch User Active Vouchers
                const userVoucherRes = await api.get('/user-voucher');
                const userVouchers = userVoucherRes.data?.Vouchers || [];

                // 2. Fetch System Vouchers (to get details like title, image, price)
                const systemVoucherRes = await api.get('/vouchers');
                const systemVouchers = systemVoucherRes.data?.Vouchers || [];

                // 3. Merge Data
                const mergedVouchers = userVouchers.map(uv => {
                    const details = systemVouchers.find(v => v.id == uv.voucher_id);
                    return {
                        ...uv,
                        title: details?.title || "Voucher",
                        image: details?.voucher_image,
                        discount_price: details?.discount_price,
                        valid_until: details?.expired_at,
                        umkm_address: details?.umkm_address
                    };
                });

                setActiveVouchers(mergedVouchers);

                // Handle post-purchase redirect: try to focus on the newly purchased voucher
                if (location.state?.purchaseData) {
                    const newId = location.state.purchaseData.id; // user_voucher id
                    // Note: purchaseData from controller is the user_voucher record
                    // We might need to match by ID or UUID if available. 
                    // Let's just default to the last one (newest) if we can't match easily, 
                    // or mapping logic might put it at the end.
                    // For now, default to 0 is fine, or last one.
                    if (mergedVouchers.length > 0) {
                        setCurrentIndex(mergedVouchers.length - 1);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch vouchers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [location.state]);

    // Format Helper
    const formatPrice = (price) => {
        return price ? new Intl.NumberFormat('id-ID').format(String(price).replace(/\./g, '')) : '0';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white z-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#012E34]"></div>
                <p className="mt-4 text-[#012E34] font-bold text-lg animate-pulse">Memuat Voucher...</p>
            </div>
        );
    }

    if (activeVouchers.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
                <p className="text-gray-500 mb-4 font-bold text-lg">Belum ada voucher aktif.</p>
                <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-[#012E34] text-white px-8 py-3 rounded-xl font-bold"
                >
                    Kembali ke Dashboard
                </button>
                <BottomNav />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex justify-center font-sans">
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col pb-24">

                {/* Header */}
                <div className="px-6 pt-8 pb-4 flex items-center justify-between relative">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="back-button"
                    >
                        <ChevronLeft size={28} color="white" strokeWidth={3} />
                    </button>
                    <h1 className="text-2xl font-black text-black absolute left-1/2 -translate-x-1/2">Voucher Ku</h1>
                </div>

                {/* Slider Container */}
                <div className="flex-1 flex flex-col items-center justify-center relative w-full overflow-hidden">

                    {/* Cards Track */}
                    <div
                        className="flex transition-transform duration-300 ease-out w-full"
                        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                    >
                        {activeVouchers.map((voucher, index) => (
                            <div key={voucher.id} className="w-full flex-shrink-0 px-8 flex justify-center">
                                {/* Voucher Card */}
                                <div className="bg-[#012E34] rounded-l w-full max-w-[340px] aspect-[4/6] relative flex flex-col items-center shadow-2xl overflow-hidden pt-6">

                                    {/* Top Section: Info */}
                                    <div className="flex flex-row items-center w-full px-5 mb-4 gap-4 mt-2">
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0 bg-gray-200">
                                            <img
                                                src={voucher.image ? `${import.meta.env.VITE_API_BASE_URL}/public/storage/voucher/${voucher.image}` : 'https://placehold.co/100x100?text=V'}
                                                alt={voucher.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col items-start text-left">
                                            <h2 className="text-white text-lg font-bold leading-tight mb-1">{voucher.title}</h2>
                                            <div className="text-white text-base font-bold leading-none">
                                                Rp {formatPrice(voucher.discount_price)} <span className="font-normal text-xs text-gray-200">Diskon</span>
                                            </div>
                                            <p className="text-gray-300 text-[10px] mt-1">
                                                Valid hingga {formatDate(voucher.valid_until)}
                                            </p>
                                            <div className="flex items-center mt-1">
                                                <MapPin size={12} className="text-gray-300 mr-1 flex-shrink-0" />
                                                <div className="text-[10px] text-gray-300 truncate max-w-[120px] font-medium">
                                                    {voucher.umkm_address || 'Alamat tidak tersedia'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* QR Code Section (Center) */}
                                    <div className="flex-1 flex items-center justify-center w-full bg-[#012E34] relative z-10 py-2">
                                        <div className="bg-white p-3 rounded-xl w-64 h-64 flex items-center justify-center">
                                            <img
                                                // src={`${import.meta.env.VITE_API_BASE_URL}/public/storage/voucher_qr/users/${voucher.user_voucher_qr_path}`}
                                                src={`${import.meta.env.VITE_API_BASE_URL}/public/storage/${voucher.user_voucher_qr_path}`}
                                                alt="QR Code"
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                    </div>

                                    {/* Separator Line */}
                                    <div className="w-full px-6 my-4 relative">
                                        <div className="border-t-2 border-dashed border-white/30 w-full h-1"></div>
                                        {/* Cutouts */}
                                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
                                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full"></div>
                                    </div>


                                    {/* Bottom Branding */}
                                    <div className="mb-12 mt-auto">
                                        <span className="text-white font-black tracking-widest text-xl">K-CLEAN</span>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex gap-2 mt-8 justify-center">
                        {activeVouchers.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all ${idx === currentIndex ? 'bg-[#012E34] w-6' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>

                </div>

            </div>
            <BottomNav />
        </div>
    );
};

export default VoucherKu;
