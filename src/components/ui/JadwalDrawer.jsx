import React from 'react';
import { cn } from '../../lib/utils';

const JadwalDrawer = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Backdrop */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            {/* Drawer */}
            <div className={cn(
                "fixed bottom-0 left-0 right-0 bg-primary z-[70] rounded-t-[2.5rem] p-6 transition-transform duration-300 max-w-md mx-auto text-white",
                isOpen ? "translate-y-0" : "translate-y-full"
            )}>
                 {/* Handle for drag indicator appearance */}
                <div className="w-12 h-1.5 bg-white/30 rounded-full mx-auto mb-6" />

                <div className="text-center mb-8">
                     <h2 className="text-xl font-bold">Jadwal Transfer Depo</h2>
                </div>

                <div className="space-y-4 mb-20">
                    <h3 className="font-semibold text-lg">Jam Operasional</h3>
                    <div className="flex justify-between items-center text-sm font-medium">
                        <span>Buka Senin - Minggu</span>
                        <span>18.00 - 06.00</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JadwalDrawer;
