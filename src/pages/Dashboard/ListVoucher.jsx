import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Ticket, Calendar, Search, Edit } from 'lucide-react';

const ListVoucher = () => {
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const res = await api.get('/voucher');
                setVouchers(res.data.Vouchers || res.data.data || []);
            } catch (error) {
                console.error("Gagal ambil voucher:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVouchers();
    }, []);

    const filteredVouchers = vouchers
        .filter(v => v.title.toLowerCase().includes(searchTerm.toLowerCase()) && v.limit > 0)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    const isActive = (v) => {
        return new Date(v.expired_at) >= new Date();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID').format(String(price).replace(/\./g, ''));
    };

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] pb-24 font-['Inter']">
            {/* Header */}
            <div className="bg-white px-5 py-6 shadow-sm sticky top-0 z-10 flex items-center justify-between">
                <button
                    onClick={() => navigate('/umkm-dashboard')}
                    className="w-[44px] h-[44px] bg-[#012E34] text-white rounded-xl flex items-center justify-center shadow-sm hover:scale-95 transition-transform"
                >
                    <ChevronLeft size={28} strokeWidth={3} />
                </button>
                <div className="flex-1 text-center font-extrabold text-[20px] text-black">List Voucher</div>
                <div className="w-[44px]"></div>
            </div>

            <div className="p-5 max-w-xl mx-auto">
                {/* Search Bar */}
                <div className="relative mb-6">
                    <input
                        type="text"
                        placeholder="Cari voucher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#FFC400] transition-colors shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                </div>

                {loading ? (
                    <div className="flex justify-center py-10 text-gray-500">Loading...</div>
                ) : (
                    <div className="space-y-4">
                        {filteredVouchers.length > 0 ? filteredVouchers.map((v) => (
                            <div key={v.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-[2px_2px_0px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
                                <div className="flex h-32">
                                    {/* Image Section */}
                                    <div className="w-32 h-full bg-gray-100 shrink-0 relative">
                                        {v.voucher_image ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_BASE_URL}/public/storage/voucher/${v.voucher_image}`}
                                                alt={v.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Ticket size={32} />
                                            </div>
                                        )}
                                        <div className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${isActive(v) ? 'bg-green-500' : 'bg-red-500'}`}>
                                            {isActive(v) ? 'Aktif' : 'Expired'}
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="flex-1 p-3 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-bold text-[#012E34] line-clamp-2 leading-tight mb-1">{v.title}</h3>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                                                <Calendar size={12} />
                                                <span>Exp: {formatDate(v.expired_at)}</span>
                                            </div>
                                            {/* Address Display */}
                                            {v.umkm_address && (
                                                <div className="text-xs text-gray-500 flex items-start gap-1 mb-2">
                                                    <div className="mt-0.5"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                                                    <span className="line-clamp-1">{v.umkm_address}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-end justify-between">
                                            <div className="text-[#FFC400] font-black text-lg">
                                                Rp {v.discount_price ? formatPrice(v.discount_price) : '0'}
                                            </div>
                                            {/* Edit Button (Mock functionality for now) */}
                                            {/* <button className="p-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-[#FFC400] hover:text-white transition-colors">
                                                <Edit size={16} />
                                            </button> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-xs">
                                    <span className="text-gray-500">Stok: <span className="font-bold text-[#012E34]">{v.limit}</span></span>
                                    <span className="text-gray-500">Poin: <span className="font-bold text-[#FFC400]">{v.points_required}</span></span>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-gray-400">
                                <Ticket size={48} className="mx-auto mb-3 opacity-20" />
                                <p>Belum ada voucher yang dibuat</p>
                            </div>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default ListVoucher;
