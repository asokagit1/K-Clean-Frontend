import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, X, Home, Scan } from 'lucide-react';
import api from '../../api/axios';

const UmkmScan = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [scanResult, setScanResult] = useState(null);
    const [isScanning, setIsScanning] = useState(true);
    const [redemptionResult, setRedemptionResult] = useState(null);
    const [showResultSheet, setShowResultSheet] = useState(false);
    const [loading, setLoading] = useState(false);

    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        // Cleaning up potential previous instance first
        if (html5QrCodeRef.current) {
            try {
                if (html5QrCodeRef.current.isScanning) {
                    html5QrCodeRef.current.stop();
                }
            } catch (e) { }
        }

        const initializeScanner = async () => {
            // Check if element exists directly from DOM to be sure
            if (!document.getElementById("reader")) return;

            html5QrCodeRef.current = new Html5Qrcode("reader");

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: window.innerWidth / window.innerHeight
            };

            try {
                await html5QrCodeRef.current.start(
                    { facingMode: "environment" },
                    config,
                    (decodedText) => {
                        handleScanSuccess(decodedText);
                    },
                    (errorMessage) => {
                        // ignore frame errors
                    }
                );
            } catch (err) {
                console.warn("Error starting scanner:", err);
            }
        };

        if (isScanning) {
            // Small timeout to allow DOM layout to settle
            const timer = setTimeout(() => {
                initializeScanner();
            }, 500);

            // Return cleanup function that handles both timer and scanner
            return () => {
                clearTimeout(timer);
                if (html5QrCodeRef.current) {
                    try {
                        html5QrCodeRef.current.stop().then(() => {
                            html5QrCodeRef.current.clear();
                        }).catch(err => {
                            console.warn("Stop failed", err);
                        });
                    } catch (err) {
                        console.warn("Cleanup error", err);
                    }
                }
            };
        }

        // Cleanup if isScanning becomes false (though logic usually handles this via isScanning dependency re-run)
        return () => {
            if (html5QrCodeRef.current) {
                try {
                    html5QrCodeRef.current.stop().catch(() => { });
                    html5QrCodeRef.current.clear();
                } catch (err) {
                    console.warn("Cleanup error", err);
                }
            }
        };
    }, [isScanning]);

    const handleScanSuccess = async (decodedText) => {
        try {
            if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
                await html5QrCodeRef.current.stop();
            }
        } catch (e) {
            console.warn("Error stopping scanner", e);
        }
        setIsScanning(false);

        let uuid = decodedText;
        if (decodedText.includes('/')) {
            const parts = decodedText.split('/');
            uuid = parts[parts.length - 1] || parts[parts.length - 2];
        }

        setScanResult(uuid);
        fetchVoucherDetails(uuid);
    };

    const fetchVoucherDetails = async (uuid) => {
        setLoading(true);
        try {
            const response = await api.get(`/voucher-check/${uuid}`);
            setRedemptionResult({
                type: 'details',
                success: true,
                data: response.data.data
            });
            setShowResultSheet(true);
        } catch (error) {
            console.error("Error checking voucher:", error);

            // Periksa jika error 400 (Voucher invalid/sudah dipakai)
            const isInvalid = error.response?.status === 400;
            const title = isInvalid ? 'Voucher Tidak Valid' : 'Gagal!';

            setRedemptionResult({
                type: 'error',
                success: false,
                title: title,
                message: error.response?.data?.message || "Voucher tidak valid atau tidak ditemukan."
            });
            setShowResultSheet(true);
        } finally {
            setLoading(false);
        }
    };

    const processRedemption = async () => {
        if (!scanResult) return;
        setLoading(true);
        try {
            const response = await api.post(`/voucher-redemption/${scanResult}`);

            // Success state - user successfully redeemed
            let resultData = response.data.data || response.data.Data;
            let mappedData = {
                ...resultData,
                voucher_name: resultData?.user_voucher?.voucher?.title || resultData?.voucher_name || 'Voucher'
            };

            setRedemptionResult({
                type: 'success',
                success: true,
                data: mappedData,
                message: "Voucher Berhasil Diterapkan"
            });
        } catch (error) {
            console.error("Error redeeming voucher:", error);

            // Handle potential late errors during redemption
            const isInvalid = error.response?.status === 400;
            const title = isInvalid ? 'Voucher Tidak Valid' : 'Gagal!';

            setRedemptionResult({
                type: 'error',
                success: false,
                title: title,
                message: error.response?.data?.message || "Voucher tidak valid atau gagal ditukarkan."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSheet = () => {
        if (redemptionResult?.success) {
            navigate('/umkm-dashboard');
        } else {
            setShowResultSheet(false);
            setScanResult(null);
            setRedemptionResult(null);
            setIsScanning(true);
        }
    };

    // Helper for image URL
    const getVoucherImage = (imageName) => {
        if (!imageName) return "https://placehold.co/100x100?text=V";
        return `${import.meta.env.VITE_API_BASE_URL}/storage/voucher/${imageName}`;
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        // If price is string "1.000", remove dots to parse as integer 1000
        const cleanPrice = String(price).replace(/\./g, '');
        return new Intl.NumberFormat('id-ID').format(cleanPrice);
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            {/* Header / Instructions */}
            <div className="absolute top-20 left-0 right-0 z-20 flex flex-col items-center">
                <div className="bg-[#012E34]/80 backdrop-blur-sm px-6 py-3 rounded-full">
                    <span className="text-white text-base font-medium">Scan QR Voucher</span>
                </div>
            </div>

            {/* Scanner Area */}
            <div className="absolute inset-0 z-0">
                <style>
                    {`
                        #reader video {
                            object-fit: cover !important;
                            width: 100% !important;
                            height: 100% !important;
                        }
                    `}
                </style>
                <div id="reader" ref={scannerRef} className="w-full h-full"></div>
            </div>

            {/* Result Bottom Sheet */}
            {showResultSheet && redemptionResult && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F8FCF9] rounded-t-[30px] p-6 pb-24 shadow-[0_-5px_20px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300 min-h-[50vh] flex flex-col">
                    <div className="w-12 h-1.5 bg-[#012E34] rounded-full mb-8 self-center"></div>

                    {redemptionResult.type === 'details' && redemptionResult.data && (
                        <div className="flex flex-col items-center w-full px-4">
                            {/* Voucher Details Card */}
                            <div className="bg-[#F8FCF9] w-full flex flex-row items-center gap-4 mb-8">
                                <img
                                    src={getVoucherImage(redemptionResult.data.voucher?.voucher_image || redemptionResult.data.voucher?.image)}
                                    alt="Voucher"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm"
                                />
                                <div className="flex flex-col items-start text-left">
                                    <h3 className="text-[#012E34] font-bold text-xl mb-1">{redemptionResult.data.voucher?.title || 'Voucher'}</h3>
                                    <div className="text-[#012E34] font-bold text-lg mb-1">
                                        Rp {formatPrice(redemptionResult.data.voucher?.discount_price)} <span className="text-[#012E34]" style={{ fontSize: '0.9em' }}>Diskon</span>
                                    </div>
                                    <p className="text-gray-500 text-sm">Valid hingga {formatDate(redemptionResult.data.voucher?.expired_at)}</p>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <button
                                onClick={processRedemption}
                                disabled={loading}
                                className="w-full py-4 bg-[#012E34] hover:bg-[#012429] text-white text-lg rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all disabled:opacity-70"
                            >
                                {loading ? 'Memproses...' : 'Terapkan Voucher'}
                            </button>
                        </div>
                    )}

                    {(redemptionResult.type === 'success' || redemptionResult.type === 'error') && (
                        <div className="flex flex-col items-center text-center mt-4">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${redemptionResult.success ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {redemptionResult.success ? (
                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ) : (
                                    <X size={40} />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-[#012E34] mb-2">
                                {redemptionResult.title || (redemptionResult.success ? 'Berhasil!' : 'Gagal!')}
                            </h2>
                            <p className="text-gray-600 font-medium mb-6 px-4">
                                {redemptionResult.message}
                            </p>
                            <button
                                onClick={handleCloseSheet}
                                className="w-full py-3.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-bold shadow-sm active:scale-[0.98] transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Navbar (UMKM Style) */}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
                <div onClick={() => navigate('/umkm-dashboard')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Home size={28} className="text-white" />
                        {isActive('/umkm-dashboard') && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Scan size={28} className="text-white" />
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
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

export default UmkmScan;
