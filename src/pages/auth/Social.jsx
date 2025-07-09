import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router';
import Button from '../../components/ui/Button';
import { FcGoogle } from 'react-icons/fc';
import Spinner from '../../components/ui/Spinner';

const Social = () => {
    const { createUserWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showSpinner, setShowSpinner] = useState(false);

    // google sign in
    const handleSignInWithGoogle = async () => {
        try {
            await createUserWithGoogle();
            setShowSpinner(true);
            // Redirect to the desired route after sign in
            const from = location.state?.from?.pathname || "/";
            setTimeout(() => {
                navigate(from, { replace: true });
            }, 1500);
        } catch (error) {
            console.error('Google sign-in error:', error);
            let errorMessage = "Sign in failed. Please try again.";
            if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = "Sign in was cancelled.";
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = "Pop-up was blocked. Please allow pop-ups and try again.";
            } else if (error.code === 'auth/account-exists-with-different-credential') {
                errorMessage = "An account already exists with the same email address but different sign-in credentials.";
            }
            Swal.fire({
                title: "Sign In Failed",
                text: errorMessage,
                icon: "error",
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="relative">
            {showSpinner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100/80">
                    <Spinner />
                    <span className="ml-4 text-lg font-semibold text-primary">Loading...</span>
                </div>
            )}
            <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-base-content/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-base-100 text-base-content/60">OR</span>
                </div>
            </div>
            <Button
                onClick={handleSignInWithGoogle}
                variant="outline"
                className="w-full flex justify-center items-center gap-3 text-base font-medium hover:bg-base-200"
            >
                <FcGoogle className="text-xl" />
                Sign Up with Google
            </Button>
        </div>
    );
};

export default Social;