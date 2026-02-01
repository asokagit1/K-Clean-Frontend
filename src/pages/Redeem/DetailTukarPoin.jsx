import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import api from '../../api/axios';
import BottomNav from '../../components/ui/BottomNav';

const DetailTukarPoin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    const [voucher, setVoucher] = useState(location.state?.voucher || null);
    const [userPoints, setUserPoints] = useState(0);
    const [loading, setLoading] = useState(false);

    // Popup States
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMsg, setSuccessMsg] = useState(''); // Keep for fallback or internal logic

    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const response = await api.get('/user-points');
                if (response.data && response.data.User_Points && response.data.User_Points.length > 0) {
                    setUserPoints(parseFloat(response.data.User_Points[0].points) || 0);
                }
            } catch (error) {
                console.error("Failed to fetch points", error);
            }
        };

        const fetchVoucherIfNeeded = async () => {
            if (!voucher) {
                try {
                    const response = await api.get('/vouchers');
                    if (response.data && response.data.Vouchers) {
                        const found = response.data.Vouchers.find(v => v.id == id);
                        if (found) setVoucher(found);
                    }
                } catch (e) { console.error(e) }
            }
        };

        fetchPoints();
        fetchVoucherIfNeeded();
    }, [id, voucher]);

    const handleRedeem = async () => {
        if (!voucher) return;

        const currentPoints = parseFloat(userPoints);
        const requiredPoints = parseFloat(voucher.points_required);

        if (currentPoints < requiredPoints) {
            alert("Poin anda tidak mencukupi!");
            return;
        }

        // if (!window.confirm("Apakah anda yakin ingin menukar poin dengan voucher ini?")) return;

        setShowProcessModal(true); // Show processing
        setLoading(true);

        try {
            const response = await api.post(`/voucher-purchase/${voucher.id}`);

            // Wait a bit to show processing (optional UX)
            setTimeout(() => {
                setShowProcessModal(false);
                setShowSuccessModal(true); // Show success

                // Navigate after showing success
                setTimeout(() => {
                    const purchaseData = response.data['Voucher Data'];
                    navigate('/voucher-ku', {
                        state: {
                            purchaseData: purchaseData,
                            voucherTitle: voucher.title
                        }
                    });
                }, 2000);
            }, 1500);

        } catch (error) {
            console.error("Redemption failed", error);
            setShowProcessModal(false);
            alert("Gagal menukar voucher: " + (error.response?.data?.message || "Terjadi kesalahan"));
        } finally {
            setLoading(false);
        }
    };

    if (!voucher) return <div className="p-8 text-center">Loading voucher...</div>;

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(String(price).replace(/\./g, ''));
    };

    return (
        <div className="min-h-screen bg-white flex justify-center font-sans">
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col pb-24">

                {/* Header */}
                <div className="px-6 pt-8 pb-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-[#012E34] rounded-xl flex items-center justify-center text-white shadow-sm"
                    >
                        <ChevronLeft size={28} color="white" strokeWidth={3} />
                    </button>
                    <h1 className="text-2xl font-black text-black flex-1 text-center pr-10">Voucher</h1>
                </div>

                {/* Body */}
                <div className="px-6">
                    <div className="mb-4 text-black font-bold text-lg">
                        Point anda: <span className="text-[#FFB800]">{userPoints} eco</span>
                    </div>

                    {/* Card */}
                    <div className="bg-[#012E34] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg min-h-[400px] flex flex-col items-center text-center">

                        <div className="absolute -left-6 bottom-24 w-12 h-12 bg-white rounded-full"></div>
                        <div className="absolute -right-6 bottom-24 w-12 h-12 bg-white rounded-full"></div>
                        <div className="absolute left-6 right-6 bottom-[104px] border-b-2 border-dashed border-white/50"></div>

                        <div className="mb-6 mt-4">
                            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20 mx-auto mb-4">
                                <img
                                    src={voucher.voucher_image ? `${import.meta.env.VITE_API_BASE_URL}/storage/voucher/${voucher.voucher_image}` : 'https://placehold.co/100x100?text=Voucher'}
                                    alt={voucher.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h2 className="text-xl font-bold">{voucher.title}</h2>
                            <div className="text-2xl font-bold my-1">
                                Rp {voucher.discount_price ? formatPrice(voucher.discount_price) : 0} <span className="text-base font-normal">Diskon</span>
                            </div>
                            <p className="text-xs text-gray-300">
                                Valid hingga {new Date(voucher.expired_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="mb-8 px-4">
                            <p className="text-sm mb-4">
                                Memerlukan <span className="text-[#FFB800] font-bold">{voucher.points_required} point eco</span> untuk menukarkan voucher
                            </p>

                            <ul className="text-left text-xs space-y-2 list-disc pl-4 text-gray-200">
                                <li>Voucher dapat ditukar pada UMKM Kaliuntu</li>
                                <li>Penukaran voucher hanya dapat dilakukan 1 kali</li>
                                <li>Voucher yang melewati batas valid tidak dapat digunakan</li>
                            </ul>
                        </div>

                        <div className="mt-auto w-full flex justify-center pb-2">
                            <button
                                onClick={handleRedeem}
                                disabled={loading || parseFloat(userPoints) < parseFloat(voucher.points_required)}
                                className={`w-4/5 py-3 rounded-xl font-bold text-lg shadow-md transition-all ${parseFloat(userPoints) < parseFloat(voucher.points_required)
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                                    : 'bg-[#FFB800] text-white hover:bg-[#e0a200]'
                                    }`}
                            >
                                Tukar
                            </button>
                        </div>

                    </div>
                </div>

                {/* Processing Modal */}
                {showProcessModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-[#FFFFF0] rounded-3xl p-8 w-64 aspect-square flex flex-col items-center justify-center text-center shadow-xl animate-in fade-in zoom-in duration-200">
                            <div className="w-20 h-20 mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                                <svg width="60" height="60" viewBox="0 0 24 24" fill="#FFB800" stroke="none">
                                    <circle cx="8" cy="8" r="7" stroke="#B48200" strokeWidth="2" opacity="0.8" />
                                    <circle cx="16" cy="16" r="7" stroke="#B48200" strokeWidth="2" />
                                    <circle cx="16" cy="8" r="7" stroke="#B48200" strokeWidth="2" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-extrabold text-[#0D0D0D]">Sedang diproses...</h3>
                        </div>
                    </div>
                )}

                {/* Success Modal */}
                {showSuccessModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-[#F0FFF4] rounded-3xl p-8 w-64 aspect-square flex flex-col items-center justify-center text-center shadow-xl animate-in fade-in zoom-in duration-200">
                            <div className="w-20 h-20 mb-4 rounded-full border-[6px] border-[#012E34] flex items-center justify-center p-2">
                                <svg className="w-12 h-12 text-[#012E34]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-extrabold text-[#0D0D0D]">Berhasil ditukar</h3>
                        </div>
                    </div>
                )}

            </div>
            <BottomNav />
        </div>
    );
};

export default DetailTukarPoin;
