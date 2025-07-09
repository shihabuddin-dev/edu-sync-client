import { Link } from 'react-router';
import Lottie from 'lottie-react';
import notFoundAnimation from '../../assets/lotti/education.json'; // Replace with a 404 animation if you have one
import Button from '../../components/ui/Button';

const NotFound = () => {
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
                <Link to="/">
                    <Button>Go Home</Button>
                </Link>
            </div>
        </div>
    );
};

export default NotFound;