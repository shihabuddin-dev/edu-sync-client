import React from 'react';
import { FaBan } from 'react-icons/fa';
import { useNavigate } from 'react-router';
import Button from '../../components/ui/Button';

const Forbidden = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center px-4">
            <div className=" rounded-md shadow-md p-10 flex flex-col items-center max-w-md w-full">
                <FaBan className="text-red-500 text-7xl mb-4 animate-pulse" />
                <h1 className="text-3xl font-bold text-red-600 mb-2">403 Forbidden</h1>
                <p className="text-base-content mb-6 text-center">
                    Oops! You don&apos;t have permission to access this page.<br />
                    If you think this is a mistake, please contact the administrator.
                </p>
                <Button
                    variant='danger'
                    onClick={() => navigate('/dashboard')} > Go to Dashboard
                </Button>
            </div>
        </div>
    );
};

export default Forbidden;