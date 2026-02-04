import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';

const EmailVerification = () => {
    const { resendVerification, logout } = useAuth();
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleResend = async () => {
        setIsLoading(true);
        try {
            await resendVerification();
            setMessage('Verification link has been sent to your email.');
        } catch (err) {
            setMessage('Failed to send verification link.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-6">
                <h1 className="text-2xl font-bold text-primary">Verify Your Email</h1>
                <p className="text-gray-600">
                    Before proceeding, please check your email for a verification link.
                </p>

                {message && (
                    <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm">
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <Button
                        onClick={handleResend}
                        className="w-full bg-primary"
                        isLoading={isLoading}
                    >
                        Resend Verification Email
                    </Button>

                    <button
                        onClick={logout}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                    >
                        Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailVerification;
