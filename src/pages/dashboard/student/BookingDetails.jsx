import React from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import {
    FaCalendarAlt,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaRegClock,
    FaMoneyBill,
    FaArrowLeft,
    FaCreditCard,
    FaReceipt,
    FaIdCard,
    FaCalendarCheck,
    FaShieldAlt
} from 'react-icons/fa';
import { MdMenuBook, MdVerified } from 'react-icons/md';
import Button from '../../../components/ui/Button';
import Reviews from '../../studySessions/Reviews';
import Recomanded from '../../studySessions/Recomanded';

const BookingDetails = () => {
    const { id: bookingId } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { data: booking, isLoading, isError, error } = useQuery({
        queryKey: ['booking-details', bookingId],
        queryFn: async () => {
            const res = await axiosSecure(`/bookedSessions/${bookingId}`);
            return res.data;
        },
        enabled: !!bookingId,
    });

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

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get payment status badge
    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return <span className="badge badge-success gap-2"><FaCheckCircle /> Paid</span>;
            case 'pending':
                return <span className="badge badge-warning gap-2"><FaRegClock /> Pending</span>;
            case 'failed':
                return <span className="badge badge-error gap-2"><FaTimesCircle /> Failed</span>;
            default:
                return <span className="badge badge-neutral gap-2">Unknown</span>;
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4 text-base-content/70">Loading booking details...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center text-error">
                <h2 className="text-2xl font-bold mb-2">Error Loading Booking</h2>
                <p>{error.message}</p>
                <Button
                    onClick={() => navigate('/dashboard/student/my-bookings')}
                    className="mt-4"
                >
                    Back to My Bookings
                </Button>
            </div>
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Booking Not Found</h2>
                <p className="text-base-content/70 mb-4">The booking you're looking for doesn't exist.</p>
                <Button
                    onClick={() => navigate('/dashboard/student/my-bookings')}
                >
                    Back to My Bookings
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
                        onClick={() => navigate('/dashboard/student/my-bookings')}
                        className="btn btn-sm mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to My Bookings
                    </Button>
                    <DashboardHeading
                        title="Booking Details"
                        icon={MdMenuBook}
                        description="Detailed information about your booking"
                    />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Main Booking Card */}
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden mb-8">
                    <div className="p-6">
                        {/* Header with Title and Status */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-base-content mb-2">
                                    {booking.sessionDetails?.title || 'Session Title'}
                                </h1>
                                <div className="flex items-center gap-4 flex-wrap">
                                    {getPaymentStatusBadge(booking.paymentStatus)}
                                    <div className="flex items-center gap-1">
                                        <MdVerified className="text-primary text-lg" />
                                        <span className="font-semibold">Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Session Information */}
                        <div className="bg-base-200 rounded-md p-4 mb-6">
                            <div className="flex items-center gap-3">
                                {booking.tutorImage ? <img className="w-12 h-12 object-cover border-primary border-2" src={booking.tutorImage} /> : <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                    <FaUser className="text-primary text-xl" />
                                </div>}
                                <div>
                                    <h3 className="font-semibold text-lg">{booking.sessionDetails?.tutorName}</h3>
                                    <p className="text-base-content/70">Expert Tutor</p>
                                </div>
                            </div>
                        </div>

                        {/* Session Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Class Schedule */}
                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaCalendarAlt className="text-primary" />
                                    Class Schedule
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div>
                                        <span className="text-base-content/70">Start:</span>
                                        <span className="ml-2 font-medium">
                                            {booking.sessionDetails?.classStart
                                                ? `${formatDate(booking.sessionDetails.classStart)} at ${formatTime(booking.sessionDetails.classStart)}`
                                                : 'TBD'
                                            }
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-base-content/70">End:</span>
                                        <span className="ml-2 font-medium">
                                            {booking.sessionDetails?.classEnd
                                                ? `${formatDate(booking.sessionDetails.classEnd)} at ${formatTime(booking.sessionDetails.classEnd)}`
                                                : 'TBD'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaRegClock className="text-primary" />
                                    Duration
                                </h4>
                                <p className="text-lg font-medium">{booking.sessionDetails?.duration || 'TBD'}</p>
                            </div>

                            {/* Payment Amount */}
                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaMoneyBill className="text-primary" />
                                    Payment Amount
                                </h4>
                                <p className="text-lg font-medium">{formatCurrency(booking.amount)}</p>
                            </div>

                            {/* Booking Date */}
                            <div className="bg-base-200 rounded-md p-4">
                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                    <FaCalendarCheck className="text-primary" />
                                    Booked On
                                </h4>
                                <p className="text-lg font-medium">{formatDate(booking.bookedAt)}</p>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="border-t border-base-300 pt-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <FaCreditCard className="text-primary" />
                                Payment Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-base-200 rounded-md p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <FaReceipt className="text-primary" />
                                        Payment Details
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-base-content/70">Payment Method:</span>
                                            <span className="font-medium capitalize">{booking.paymentMethod}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-base-content/70">Amount Paid:</span>
                                            <span className="font-medium">{formatCurrency(booking.amount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-base-content/70">Status:</span>
                                            <span>{getPaymentStatusBadge(booking.paymentStatus)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-base-200 rounded-md p-4">
                                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                                        <FaIdCard className="text-primary" />
                                        Transaction Details
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-base-content/70">Booking ID:</span>
                                            <p className="font-medium font-mono text-xs break-all">{booking._id}</p>
                                        </div>
                                        {booking.transactionId && (
                                            <div>
                                                <span className="text-base-content/70">Transaction ID:</span>
                                                <p className="font-medium font-mono text-xs break-all">{booking.transactionId}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 bg-success/10 border border-success/20 rounded-md p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <FaShieldAlt className="text-success" />
                                <span className="font-medium text-success">Booking Confirmed</span>
                            </div>
                            <p className="text-sm text-success/80">
                                Your booking has been confirmed and your payment has been processed securely.
                                You will receive a confirmation email with further details about your session.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Reviews />
            <Recomanded />
        </div>
    );
};

export default BookingDetails; 