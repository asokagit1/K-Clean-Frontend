import React from 'react';
import { Home, TicketPercent, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

const BottomNav = () => {
    const location = useLocation();

    // Check if we are on a path that matches the link
    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] bg-[#012E34] h-[60px] rounded-xl flex justify-around items-center px-4 text-white shadow-xl z-50">
            <Link to="/dashboard" className="flex flex-col items-center gap-1">
                <div className={cn(
                    "p-2 rounded-xl transition-all duration-300 relative",
                )}>
                    <Home size={28} className="text-white" />
                    {isActive('/dashboard') && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                </div>
            </Link>

            <Link to="/voucher-ku" className="flex flex-col items-center gap-1">
                <div className={cn(
                    "p-2 rounded-xl transition-all duration-300 relative",
                )}>
                    <TicketPercent size={28} className="text-white" />
                    {isActive('/voucher-ku') && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                </div>
            </Link>

            <Link to="/profile" className="flex flex-col items-center gap-1">
                <div className={cn(
                    "p-2 rounded-xl transition-all duration-300 relative",
                )}>
                    <User size={28} className="text-white" />
                    {isActive('/profile') && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default BottomNav;
