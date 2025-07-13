import React from 'react';
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
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const DetailsStudySession = () => {
    const { user } = useAuth();
    const { role, roleLoading } = useUserRole();
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosInstance = useAxios();
    const axiosSecure=useAxiosSecure()

    const { data: session, isLoading, isError, error } = useQuery({
        queryKey: ['session-details', id],
        queryFn: async () => {
            const res = await axiosInstance(`/sessions/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const { data: myBookings = [], isLoading: bookingsLoading } = useQuery({
        queryKey: ['student-bookings', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosInstance(`/bookedSessions/student/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const isRegistrationOpen = () => {
        if (!session) return false;
        const now = new Date();
        const regStart = new Date(session.registrationStart);
        const regEnd = new Date(session.registrationEnd);
        return now >= regStart && now <= regEnd;
    };

    const alreadyBooked = myBookings.some(
        (booking) => booking.sessionId === id
    );

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleBooking = async () => {
        if (!user) {
            navigate('/signin');
            return;
        }

        if (role !== 'student') {
            Swal.fire({
                icon: 'info',
                title: 'Students Only',
                text: 'Only students can book study sessions.',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (session.registrationFee > 0 && session.paid === true) {
            navigate(`/payment/${session._id}`);
        } else {
            try {
                const bookingData = {
                    sessionId: session._id,
                    studentEmail: user.email,
                    amount: session.registrationFee,
                    paymentStatus: session.registrationFee > 0 ? 'pending' : 'free',
                    paymentMethod: session.registrationFee > 0 ? 'card' : 'free',
                };

                const res = await axiosSecure.post('/bookedSessions', bookingData);

                if (res.data?.insertedId || res.data?.bookingId) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Session Booked!',
                        text: 'You have successfully booked the session.',
                        confirmButtonText: 'Go to My Bookings'
                    }).then(() => {
                        navigate('/dashboard/student/my-bookings');
                    });
                } else {
                    throw new Error('Failed to book the session.');
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Booking Failed',
                    text: error?.response?.data?.message || error.message || 'Something went wrong while booking the session.',
                });
            }
        }
    };

    if (isLoading || bookingsLoading) return (
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
                <Button onClick={() => navigate('/study-sessions')} className="mt-4">Back to Sessions</Button>
            </div>
        </div>
    );

    if (!session) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Session Not Found</h2>
                <p className="text-base-content/70 mb-4">The session you're looking for doesn't exist.</p>
                <Button onClick={() => navigate('/study-sessions')}>Back to Sessions</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            <div className="bg-base-100 shadow-md pb-2">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button onClick={() => navigate(-1)} className="btn btn-sm mb-4">
                        <FaArrowLeft className="mr-2" />
                        Back
                    </Button>
                    <SectionTitle title="Session Details" icon={<MdMenuBook />} />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden mb-8">
                    {session.sessionImage && (
                        <div className="w-full h-64 bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                            <img src={session.sessionImage} alt={session.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="p-6">
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

                        <div className="bg-base-200 rounded-md p-4 mb-6">
                            <div className="flex items-center gap-3">
                                {session.tutorImage ? (
                                    <img src={session.tutorImage} className='w-12 h-12 object-cover rounded-full border-2 border-primary' />
                                ) : (
                                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                        <FaUser className="text-primary text-xl" />
                                    </div>
                                )}

                                <div>
                                    <h3 className="font-semibold text-lg">{session.tutorName}</h3>
                                    <p className="text-base-content/70">Expert Tutor</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                <FaBookOpen className="text-primary" />
                                About This Session
                            </h3>
                            <p className="text-base-content/80 leading-relaxed">{session.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaCalendarAlt className="text-primary" />
                                    Registration Period
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-base-content/70">Start:</span> <span className="ml-2 font-medium">{formatDate(session.registrationStart)}</span></div>
                                    <div><span className="text-base-content/70">End:</span> <span className="ml-2 font-medium">{formatDate(session.registrationEnd)}</span></div>
                                </div>
                            </div>

                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaClock className="text-primary" />
                                    Class Schedule
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-base-content/70">Start:</span> <span className="ml-2 font-medium">{formatDate(session.classStart)} at {formatTime(session.classStart)}</span></div>
                                    <div><span className="text-base-content/70">End:</span> <span className="ml-2 font-medium">{formatDate(session.classEnd)} at {formatTime(session.classEnd)}</span></div>
                                </div>
                            </div>

                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaRegClock className="text-primary" />
                                    Duration
                                </h4>
                                <p className="text-lg font-medium">{session.duration}</p>
                            </div>

                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaMoneyBill className="text-primary" />
                                    Registration Fee
                                </h4>
                                <p className="text-lg font-medium">
                                    {session.registrationFee > 0 ? `${session.registrationFee} BDT` : 'Free'}
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-base-300 pt-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-semibold mb-2">Ready to Join?</h3>
                                    <p className="text-base-content/70">
                                        {isRegistrationOpen()
                                            ? 'Registration is currently open for this session.'
                                            : 'Registration period has ended for this session.'}
                                    </p>
                                </div>
                                <div className="flex gap-1 md:gap-3">
                                    {isRegistrationOpen() ? (
                                        !roleLoading && user && role === 'student' ? (
                                            alreadyBooked ? (
                                                <>
                                                    <span className="badge badge-success gap-2 rounded mt-2"><FaCheckCircle /> Booked</span>
                                                    <Button onClick={() => navigate('/dashboard/student/my-bookings')} className="btn btn-outline btn-primary">
                                                        View My Bookings
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button onClick={handleBooking}>
                                                    Book Now
                                                </Button>
                                            )
                                        ) : (
                                            <button disabled className="btn btn-disabled cursor-not-allowed opacity-50" title={!user ? 'Please Sign In to book' : 'Only students can book sessions'}>
                                                {!user ? 'Sign In to Book' : 'Students Only'}
                                            </button>
                                        )
                                    ) : (
                                        <button disabled className="btn btn-disabled cursor-not-allowed opacity-50">
                                            Registration Closed
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews section left as-is */}
            </div>
        </div>
    );
};

export default DetailsStudySession;
