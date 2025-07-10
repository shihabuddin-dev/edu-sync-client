import { Link, useNavigate } from 'react-router';
import Lottie from 'lottie-react';
import notFoundAnimation from '../../assets/lotti/education.json';
import Button from '../../components/ui/Button';
import { FaArrowLeft, FaHome } from 'react-icons/fa';

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-base-200 px-4">
            <div className="w-full max-w-md mx-auto flex flex-col items-center">
                <div className="w-64 h-64 mb-4">
                    <Lottie animationData={notFoundAnimation} loop={true} />
                </div>
                <h1 className="text-7xl font-bold text-primary drop-shadow mb-2">404</h1>
                <h2 className="text-2xl font-semibold text-base-content mb-2">Page Not Found</h2>
                <p className="text-base-content/70 mb-4 text-center max-w-xs">
                    Oops! The page you're looking for doesn't exist or has been moved.<br />
                    Let's get you back to safety!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to='/'>
                        <Button variant='primary' className='flex items-center gap-2'>  <FaHome />
                            Go Home
                        </Button>
                    </Link>
                    <Button onClick={() => navigate(-1)} variant='outline' className="inline-flex items-center gap-2">
                        <FaArrowLeft />
                        Go Back
                    </Button>

                </div>
            </div>
        </div>
    );
};

export default NotFound;