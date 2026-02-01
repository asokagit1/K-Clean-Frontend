import React, { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, X, Home, Scan } from 'lucide-react';
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
                    html5QrCodeRef.current.stop().then(() => {
                        html5QrCodeRef.current.clear();
                    }).catch(err => {
                        console.error("Failed to stop scanner", err);
                    });
                } catch (err) {
                    console.error("Cleanup error", err);
                }
            }
        };
    }, [isScanning]);

    const handleScanSuccess = async (decodedText) => {
        if (html5QrCodeRef.current) {
            await html5QrCodeRef.current.stop();
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

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden flex flex-col">
            {/* Header / Instructions */}
            <div className="absolute top-20 left-0 right-0 z-20 flex flex-col items-center">
                <div className="bg-[#52635B]/80 backdrop-blur-sm px-6 py-3 rounded-full">
                    <span className="text-white text-base font-medium">Dekatkan QR code</span>
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
                        <h2 className="text-xl font-bold text-[#012E34] mb-1">@{userInfo.name}</h2>
                        <p className="text-gray-500 font-medium mb-6">ID: {userInfo.id}</p>

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
