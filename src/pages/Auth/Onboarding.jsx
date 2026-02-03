import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Coins, Ticket, Recycle } from 'lucide-react'; // Using Lucide icons as placeholders for illustrations

const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: 'Mudah dan cepat',
            description: 'Setorkan sampah terpilahmu pada transfer depo dan akan otomatis masuk',
            icon: <Coins size={120} className="text-secondary" />, // Gold coins
            color: 'text-primary'
        },
        {
            title: 'Dapatkan diskon',
            description: 'Tukarkan poin eco anda menjadi voucher diskon makanan atau minuman',
            icon: <Ticket size={120} className="text-secondary" />, // Ticket/Voucher
            color: 'text-primary'
        },
        // We can add the initial logo screen as step 0 if needed, keeping it simple for now
    ];

    // Design shows a Logo screen first, then these slides. 
    // Let's assume the "Logo Screen" is static or just the Header.
    // The image shows: 
    // 1. Logo Screen "Setor sampah..."
    // 2. "Mudah dan cepat" (Coins)
    // 3. "Dapatkan diskon" (Voucher)
    
    const allSteps = [
        {
            title: 'K-CLEAN',
            description: 'Setor sampah, tabung point, tukar point dan dapatkan voucher.',
            icon: <Recycle size={120} className="text-primary" />,
            isLogo: true
        },
        ...steps
    ];

    const handleNext = () => {
        if (currentStep < allSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            navigate('/login');
        }
    };

    const handleSkip = () => {
        navigate('/login');
    };

    return (
        <div className="flex flex-col h-screen bg-white p-6 justify-between items-center text-center">
            <div className="w-full flex justify-end">
                {currentStep > 0 && (
                     <button onClick={handleSkip} className="text-gray-400 p-2 text-xl font-bold">
                        &times;
                    </button>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md space-y-8">
                <div className="mb-4 animate-in fade-in zoom-in duration-500">
                    {allSteps[currentStep].icon}
                </div>

                <div className="space-y-2">
                    {allSteps[currentStep].isLogo ? (
                         <h1 className="text-3xl font-bold text-primary tracking-wider">{allSteps[currentStep].title}</h1>
                    ) : (
                        <>
                             <p className="text-secondary font-medium">Dapatkan {currentStep === 1 ? 'point' : 'voucher'}</p>
                             <h2 className="text-2xl font-bold text-primary">{allSteps[currentStep].title}</h2>
                        </>
                    )}
                   
                    <p className="text-gray-500 text-sm px-6">
                        {allSteps[currentStep].description}
                    </p>
                </div>

                 {/* Indicators */}
                 <div className="flex space-x-2 justify-center pt-4">
                    {allSteps.map((_, idx) => (
                        <div 
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                idx === currentStep ? 'w-6 bg-primary' : 'w-2 bg-gray-200'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full max-w-md pb-8">
                <Button 
                    onClick={handleNext} 
                    className="w-full rounded-2xl bg-primary hover:bg-primary/90 py-6 text-lg"
                >
                    {currentStep === allSteps.length - 1 ? 'Mulai Sekarang' : 'Lanjut'}
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
