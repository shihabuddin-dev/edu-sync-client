import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import useAuth from '../../hooks/useAuth';
import useUserRole from '../../hooks/useUserRole';
import SectionTitle from '../../components/shared/SectionTitle';
import {
    FaUser,
    FaCalendarAlt,
    FaClock,
    FaStar,
    FaBookOpen,
    FaRegClock,
    FaCheckCircle,
    FaTimesCircle,
    FaArrowLeft,
    FaMoneyBill
} from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import Button from '../../components/ui/Button';

const DetailsStudySession = () => {
    const { user } = useAuth();
    const { role, roleLoading } = useUserRole();
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const [isBooking, setIsBooking] = useState(false);

    const { data: session, isLoading, isError, error } = useQuery({
        queryKey: ['session-details', id],
        queryFn: async () => {
            const res = await axiosInstance(`/sessions/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // Check if registration is open
    const isRegistrationOpen = () => {
        if (!session) return false;
        const now = new Date();
        const regStart = new Date(session.registrationStart);
        const regEnd = new Date(session.registrationEnd);
        return now >= regStart && now <= regEnd;
    };


    // Get status badge
    const getStatusBadge = () => {
        if (!session) return null;

        switch (session.status) {
            case 'approved':
                return <span className="badge badge-success rounded gap-2"><FaCheckCircle /> Approved</span>;
            case 'pending':
                return <span className="badge badge-warning rounded gap-2"><FaRegClock /> Pending</span>;
            case 'rejected':
                return <span className="badge badge-error rounded gap-2"><FaTimesCircle /> Rejected</span>;
            default:
                return <span className="badge badge-neutral rounded gap-2">Unknown</span>;
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Format time
    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Handle booking
    const handleBooking = async () => {
        if (!user) {
            // Redirect to login if not authenticated
            navigate('/signin');
            return;
        }

        if (role !== 'student') {
            // Show message that only students can book
            alert('Only students can book study sessions.');
            return;
        }

        setIsBooking(true);
        try {
            // Add booking logic here
            console.log('Booking session:', session._id);
            // You can implement the actual booking API call here
        } catch (error) {
            console.error('Booking error:', error);
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4 text-base-content/70">Loading session details...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center text-error">
                <h2 className="text-2xl font-bold mb-2">Error Loading Session</h2>
                <p>{error.message}</p>
                <Button
                    onClick={() => navigate('/study-sessions')}
                    className="mt-4"
                >
                    Back to Sessions
                </Button>
            </div>
        </div>
    );

    if (!session) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
                <p className="text-base-content/70 mb-4">The session you're looking for doesn't exist.</p>
                <Button
                    onClick={() => navigate('/study-sessions')}
                >
                    Back to Sessions
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Header */}
            <div className="bg-base-100 shadow-md pb-2">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back
                    </Button>
                    <SectionTitle title="Session Details" icon={<MdMenuBook />} />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Main Session Card */}
                <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 overflow-hidden mb-8">
                    {/* Session Image */}
                    {session.sessionImage && (
                        <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                            <img
                                src={session.sessionImage}
                                alt={session.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    <div className="p-6">
                        {/* Header with Title and Status */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-base-content mb-2">{session.title}</h1>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {getStatusBadge()}
                                    <div className="flex items-center gap-1">
                                        <FaStar className="text-warning text-lg" />
                                        <span className="font-semibold">4.8</span>
                                        <span className="text-base-content/70">(24 reviews)</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tutor Information */}
                        <div className="bg-base-200 rounded-lg p-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <FaUser className="text-primary text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{session.tutorName}</h3>
                                    <p className="text-base-content/70">Expert Tutor</p>
                                </div>
                            </div>
                        </div>

                        {/* Session Description */}
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <FaBookOpen className="text-primary" />
                                About This Session
                            </h3>
                            <p className="text-base-content/80 leading-relaxed">{session.description}</p>
                        </div>

                        {/* Session Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Registration Period */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaCalendarAlt className="text-primary" />
                                    Registration Period
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-base-content/70">Start:</span>
                                        <span className="ml-2 font-medium">{formatDate(session.registrationStart)}</span>
                                    </div>
                                    <div>
                                        <span className="text-base-content/70">End:</span>
                                        <span className="ml-2 font-medium">{formatDate(session.registrationEnd)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Class Schedule */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaClock className="text-primary" />
                                    Class Schedule
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-base-content/70">Start:</span>
                                        <span className="ml-2 font-medium">
                                            {formatDate(session.classStart)} at {formatTime(session.classStart)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-base-content/70">End:</span>
                                        <span className="ml-2 font-medium">
                                            {formatDate(session.classEnd)} at {formatTime(session.classEnd)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaRegClock className="text-primary" />
                                    Duration
                                </h4>
                                <p className="text-lg font-medium">{session.duration}</p>
                            </div>

                            {/* Registration Fee */}
                            <div className="bg-base-200 rounded-lg p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaMoneyBill className="text-primary" />
                                    Registration Fee
                                </h4>
                                <p className="text-lg font-medium">
                                    {session.registrationFee > 0 ? `${session.registrationFee}` : 'Free'}
                                </p>
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="border-t border-base-300 pt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-semibold mb-2">Ready to Join?</h3>
                                    <p className="text-base-content/70">
                                        {isRegistrationOpen()
                                            ? 'Registration is currently open for this session.'
                                            : 'Registration period has ended for this session.'
                                        }
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    {/* Debug info */}
                                    {console.log('User:', user?.email, 'Role:', role, 'Can book:', user && role === 'student')}
                                    
                                    {isRegistrationOpen() ? (
                                        !roleLoading && user && role === 'student' ? (
                                            <Button
                                                onClick={handleBooking}
                                                disabled={isBooking}
                                            >
                                                {isBooking ? (
                                                    <>
                                                        <div className="loading loading-spinner loading-sm"></div>
                                                        Booking...
                                                    </>
                                                ) : (
                                                    'Book Now'
                                                )}
                                            </Button>
                                        ) : (
                                            <button
                                                disabled
                                                className="btn btn-disabled cursor-not-allowed opacity-50"
                                                title={!user ? 'Please Sign In to book' : 'Only students can book sessions'}
                                            >
                                                {!user ? 'Sign In to Book' : 'Students Only'}
                                            </button>
                                        )
                                    ) : (
                                        <button
                                            disabled
                                            className="btn btn-disabled cursor-not-allowed opacity-50"
                                        >
                                            Registration Closed
                                        </button>
                                    )}        
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-base-100 rounded-lg shadow-lg border border-base-300 p-6">
                    <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                        <FaStar className="text-warning" />
                        Student Reviews
                    </h3>

                    {/* Mock Reviews - Replace with actual reviews data */}
                    <div className="space-y-4">
                        <div className="border-b border-base-300 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < 5 ? "text-warning" : "text-base-300"} />
                                    ))}
                                </div>
                                <span className="font-semibold">Sarah Johnson</span>
                                <span className="text-base-content/70 text-sm">2 days ago</span>
                            </div>
                            <p className="text-base-content/80">
                                "Excellent session! The tutor explained complex concepts very clearly. Highly recommended!"
                            </p>
                        </div>

                        <div className="border-b border-base-300 pb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < 4 ? "text-warning" : "text-base-300"} />
                                    ))}
                                </div>
                                <span className="font-semibold">Mike Chen</span>
                                <span className="text-base-content/70 text-sm">1 week ago</span>
                            </div>
                            <p className="text-base-content/80">
                                "Great learning experience. The materials were well-prepared and the tutor was very patient."
                            </p>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < 5 ? "text-warning" : "text-base-300"} />
                                    ))}
                                </div>
                                <span className="font-semibold">Emily Davis</span>
                                <span className="text-base-content/70 text-sm">2 weeks ago</span>
                            </div>
                            <p className="text-base-content/80">
                                "Amazing session! I learned so much in such a short time. Will definitely join more sessions!"
                            </p>
                        </div>
                    </div>

                    {/* Add Review Button */}
                    <div className="mt-6 pt-4 border-t border-base-300">
                        <button className="btn btn-outline btn-primary">
                            Write a Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsStudySession;