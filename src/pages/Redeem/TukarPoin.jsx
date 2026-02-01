import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Home, Ticket, User, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import BottomNav from '../../components/ui/BottomNav';

const TukarPoin = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Semua');
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await api.get('/vouchers');
                // The API returns { Vouchers: [...] } based on our fix
                if (response.data && response.data.Vouchers) {
                    setVouchers(response.data.Vouchers);
                }
            } catch (error) {
                console.error("Failed to fetch vouchers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVouchers();
    }, []);

    // Filter logic
    const filteredVouchers = vouchers.filter(voucher => {
        const matchesSearch = voucher.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTab = activeTab === 'Semua' || (voucher.category && voucher.category.toLowerCase() === activeTab.toLowerCase());
        const unlimitedStock = parseFloat(voucher.limit) > 0;
        return matchesSearch && matchesTab && unlimitedStock;
    });

    const categories = ['Semua', 'Makanan', 'Minuman'];

    return (
        <div className="min-h-screen bg-white flex justify-center font-sans">
            <div className="w-full max-w-md bg-white min-h-screen relative flex flex-col pb-24">

                {/* Header */}
                <div className="px-6 pt-8 pb-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 bg-primary-dark rounded-xl flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: '#012E34' }}
                    >
                        <ChevronLeft size={28} color="white" strokeWidth={3} />
                    </button>
                    <h1 className="text-2xl font-black text-black flex-1 text-center pr-10">Voucher</h1>
                </div>

                {/* Search Bar */}
                <div className="px-6 mb-6">
                    <div className="bg-gray-200 rounded-full flex items-center px-4 py-3">
                        <Search size={20} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Cari voucher"
                            className="bg-transparent border-none outline-none w-full text-base font-medium placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 mb-6 flex gap-8">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`text-sm font-semibold transition-colors ${activeTab === cat ? 'text-[#FFB800]' : 'text-black'
                                }`}
                            onClick={() => setActiveTab(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Voucher List */}
                <div className="px-6 space-y-4">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Loading vouchers...</div>
                    ) : (
                        filteredVouchers.length > 0 ? (
                            filteredVouchers.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full h-32 rounded-xl relative overflow-hidden flex shadow-sm cursor-pointer"
                                    style={{ backgroundColor: '#012E34' }}
                                    onClick={() => navigate(`/voucher/${item.id}`, { state: { voucher: item } })}
                                >
                                    {/* Left: Image */}
                                    <div className="w-[30%] h-full flex items-center justify-center p-3">
                                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
                                            <img
                                                src={item.voucher_image ? `http://localhost:8000/storage/voucher/${item.voucher_image}` : 'https://placehold.co/100x100?text=Voucher'}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>

                                    {/* Dashed Line Separator */}
                                    <div className="absolute left-[30%] top-2 bottom-2 w-[1px] border-l-2 border-dashed border-white/40"></div>

                                    {/* Right: Content */}
                                    <div className="flex-1 p-4 pl-6 flex flex-col justify-center text-white relative">

                                        {/* Points Badge (Top Right) */}
                                        <div className="absolute top-3 right-8 text-[#FFB800] text-xs font-bold">
                                            {item.points_required} point
                                        </div>

                                        <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
                                        <div className="text-lg font-bold mb-1">
                                            Rp {item.discount_price ? new Intl.NumberFormat('id-ID').format(String(item.discount_price).replace(/\./g, '')) : '0'} <span className="text-sm font-normal">Diskon</span>
                                        </div>
                                        <div className="text-[10px] text-gray-300">
                                            Valid hingga {new Date(item.expired_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                    </div>

                                    {/* Semi-circle Cutout */}
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-white rounded-full"></div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400">Tidak ada voucher ditemukan</div>
                        )
                    )}
                </div>
            </div>

            <BottomNav />
        </div>
    );
};

export default TukarPoin;
