import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, X, Home, Scan, Keyboard } from 'lucide-react';
import api from '../../api/axios';

const PetugasScan = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [scanResult, setScanResult] = useState(null); // This is the UUID
    const [isScanning, setIsScanning] = useState(true);
    const [userInfo, setUserInfo] = useState(null); // For the pop-up
    const [showUserSheet, setShowUserSheet] = useState(false);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showManualInput, setShowManualInput] = useState(false);
    const [manualId, setManualId] = useState('');

    const [formData, setFormData] = useState({
        trash_type: 'Plastik',
        trash_weight: '',
    });

    const scannerRef = useRef(null);
    const html5QrCodeRef = useRef(null);

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        let timer;
        const initializeScanner = async () => {
            // Use a slight delay to ensure the DOM element is ready
            timer = setTimeout(async () => {
                if (!document.getElementById("reader")) return;

                // Cleanup any existing instance first
                if (html5QrCodeRef.current) {
                    try {
                        if (html5QrCodeRef.current.isScanning) {
                            await html5QrCodeRef.current.stop();
                        }
                        html5QrCodeRef.current.clear();
                    } catch (e) { }
                }

                html5QrCodeRef.current = new Html5Qrcode("reader");

                const config = {
                    fps: 6,
                    qrbox: { width: 250, height: 250 }
                };

                try {
                    await html5QrCodeRef.current.start(
                        {
                            facingMode: "environment",
                            // focusMode: "continuous"
                        },
                        config,
                        (decodedText) => {
                            handleScanSuccess(decodedText);
                        },
                        () => { }
                    );
                } catch (err) {
                    console.error("Error starting scanner:", err);
                }
            }, 100);
        };

        if (isScanning) {
            initializeScanner();
        }

        return () => {
            if (timer) clearTimeout(timer);
            if (html5QrCodeRef.current) {
                try {
                    // Check if scanning before trying to stop
                    if (html5QrCodeRef.current.isScanning) {
                        html5QrCodeRef.current.stop().then(() => {
                            html5QrCodeRef.current.clear();
                        }).catch(err => {
                            console.warn("Failed to stop scanner", err);
                        });
                    } else {
                        html5QrCodeRef.current.clear();
                    }
                } catch (err) {
                    console.warn("Cleanup error", err);
                }
            }
        };
    }, [isScanning]);

    const handleScanSuccess = async (decodedText) => {
        if (html5QrCodeRef.current) {
            try {
                // Only stop if it's actually running to avoid errors when coming from manual input
                if (html5QrCodeRef.current.isScanning) {
                    await html5QrCodeRef.current.stop();
                }
            } catch (err) {
                console.warn("Scanner stop error:", err);
            }
        }
        setIsScanning(false);

        // Extract UUID from URL if it's a URL
        let uuid = decodedText;
        if (decodedText.includes('/trash-transaction/')) {
            const parts = decodedText.split('/trash-transaction/');
            uuid = parts[parts.length - 1];
        } else if (decodedText.includes('/')) {
            // Fallback for other URL formats, taking the last segment
            const parts = decodedText.split('/');
            uuid = parts[parts.length - 1];
        }

        setScanResult(uuid);

        // Fetch User Info
        try {
            const response = await api.get(`/profile/${uuid}`);

            setUserInfo(response.data);
            setShowUserSheet(true);
        } catch (error) {
            console.error("Error fetching user info:", error);
            // If fetch fails, maybe fallback to direct transaction or show error?
            // For now, let's assume valid QR scasn always have profiles.
            alert("Gagal mengambil data user. Scan ulang.");
            setIsScanning(true);
        }
    };

    const handleTimbangSampah = () => {
        setShowUserSheet(false);
        navigate('/petugas-timbangan', {
            state: {
                scanResult: scanResult,
                userData: userInfo
            }
        });
    };


    const handleCancel = () => {
        setShowUserSheet(false);
        setScanResult(null);
        setUserInfo(null);
        setIsScanning(true);
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        if (manualId.trim()) {
            setShowManualInput(false);
            handleScanSuccess(manualId.trim());
            setManualId('');
        }
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            {/* Header / Instructions */}
            <div className="absolute top-20 left-0 right-0 z-20 flex flex-col items-center gap-4">
                <div className="bg-[#52635B]/80 backdrop-blur-sm px-6 py-3 rounded-full">
                    <span className="text-white text-base font-medium">Dekatkan QR code</span>
                </div>

                <button
                    onClick={() => {
                        setIsScanning(false);
                        setShowManualInput(true);
                    }}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[#012E34] font-bold shadow-lg active:scale-95 transition-all"
                >
                    <Keyboard size={20} />
                    <span>Input ID Manual</span>
                </button>
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

            {/* User Info Bottom Sheet (Pop-up) */}
            {showUserSheet && userInfo && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[30px] p-6 pb-24 shadow-[0_-5px_20px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
                    <div className="flex flex-col items-center">
                        {/* Handle Bar */}
                        <div className="w-12 h-1.5 bg-[#012E34] rounded-full mb-6"></div>

                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-[#E8F5E9] p-1 mb-3 overflow-hidden">
                            {/* Checking if avatar is a URL or seed string */}
                            <img
                                src={userInfo.avatar && userInfo.avatar.startsWith('http')
                                    ? userInfo.avatar
                                    : `https://api.dicebear.com/9.x/avataaars/svg?seed=${userInfo.avatar || userInfo.name}`}
                                alt="User Avatar"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>

                        {/* Name & ID */}
                        <h2 className="text-xl font-bold text-[#012E34] mb-6">@{userInfo.name}</h2>


                        {/* Action Button */}
                        <button
                            onClick={handleTimbangSampah}
                            className="w-full py-3.5 bg-[#012E34] hover:bg-[#012429] text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all"
                        >
                            Timbang sampah
                        </button>
                    </div>
                </div>
            )}

            {/* Manual Input Modal */}
            {showManualInput && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl scale-100 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-[#012E34]">Input ID User</h3>
                            <button
                                onClick={() => {
                                    setShowManualInput(false);
                                    setIsScanning(true);
                                }}
                                className="p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleManualSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">ID Pengguna (UUID)</label>
                                <input
                                    type="text"
                                    value={manualId}
                                    onChange={(e) => setManualId(e.target.value)}
                                    placeholder="Tempel atau ketik ID disini..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#012E34] focus:border-transparent outline-none transition-all font-mono"
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-2">ID dapat dilihat di halaman profil user (dibawah QR code).</p>
                            </div>

                            <button
                                type="submit"
                                disabled={!manualId.trim()}
                                className="w-full py-3.5 bg-[#012E34] hover:bg-[#012429] text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cari User
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
                <div onClick={() => navigate('/petugas-dashboard')} className="flex flex-col items-center gap-1 cursor-pointer">
                    <div className={`p-2 rounded-xl transition-all duration-300 relative`}>
                        <Home size={28} className="text-white" />
                        {isActive('/petugas-dashboard') && (
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

export default PetugasScan;