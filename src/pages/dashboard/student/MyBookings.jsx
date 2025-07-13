import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import {
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaRegClock,
    FaMoneyBill,
    FaEye,
    FaSearch
} from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import { Link } from 'react-router';

const MyBookings = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], isLoading, isError, error } = useQuery({
        queryKey: ['student-bookings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure(`/bookedSessions/student/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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
                return <span className="badge badge-success badge-sm rounded gap-1"><FaCheckCircle /> Paid</span>;
            case 'pending':
                return <span className="badge badge-warning badge-sm rounded gap-1"><FaRegClock /> Pending</span>;
            case 'failed':
                return <span className="badge badge-error badge-sm rounded gap-1"><FaTimesCircle /> Failed</span>;
            default:
                return <span className="badge badge-neutral badge-sm rounded gap-1">Unknown</span>;
        }
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="loading loading-spinner loading-lg"></div>
                <p className="mt-4 text-base-content/70">Loading your bookings...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="text-center py-8">
            <div className="text-error">
                <h2 className="text-2xl font-bold mb-2">Error Loading Bookings</h2>
                <p>{error.message}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <DashboardHeading 
                title="My Bookings" 
                icon={MdMenuBook}
                description="View all your booked study sessions"
            />

            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-base-content/50">
                        <MdMenuBook className="text-6xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
                        <p className="mb-4">You haven't booked any study sessions yet.</p>
                        <button 
                            onClick={() => window.location.href = '/study-sessions'}
                            className="btn btn-primary"
                        >
                            Browse Sessions
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Booking History</h3>
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <FaSearch />
                                <span>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            {/* Table Head */}
                            <thead className="bg-base-200">
                                <tr>
                                    <th className="font-semibold">Session</th>
                                    <th className="font-semibold">Tutor</th>
                                    <th className="font-semibold">Date & Time</th>
                                    <th className="font-semibold">Amount</th>
                                    <th className="font-semibold">Status</th>
                                    <th className="font-semibold">Booked On</th>
                                    <th className="font-semibold text-center">Actions</th>
                                </tr>
                            </thead>
                            {/* Table Body */}
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-base-50">
                                        <td>
                                            <div className="font-medium">
                                                {booking.sessionDetails?.title || 'Session Title'}
                                            </div>
                                            <div className="text-sm text-base-content/70">
                                                {booking.sessionDetails?.duration || 'TBD'}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-primary text-sm" />
                                                <span className="font-medium">
                                                    {booking.sessionDetails?.tutorName || 'Unknown'}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <FaCalendarAlt className="text-primary" />
                                                    <span>
                                                        {booking.sessionDetails?.classStart 
                                                            ? formatDate(booking.sessionDetails.classStart)
                                                            : 'TBD'
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-base-content/70">
                                                    <FaClock className="text-primary" />
                                                    <span>
                                                        {booking.sessionDetails?.classStart && booking.sessionDetails?.classEnd
                                                            ? `${formatTime(booking.sessionDetails.classStart)} - ${formatTime(booking.sessionDetails.classEnd)}`
                                                            : 'TBD'
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1">
                                                <FaMoneyBill className="text-success" />
                                                <span className="font-medium">
                                                    {formatCurrency(booking.amount)}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {getPaymentStatusBadge(booking.paymentStatus)}
                                        </td>
                                        <td>
                                            <div className="text-sm">
                                                {formatDate(booking.bookedAt)}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex justify-center">
                                                <Link
                                                    to={`/dashboard/student/booking-details/${booking._id}`}
                                                    className="btn btn-sm btn-outline btn-primary gap-2"
                                                >
                                                    <FaEye />
                                                    Details
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="bg-base-200 px-6 py-3 border-t border-base-300">
                        <div className="flex items-center justify-between text-sm text-base-content/70">
                            <span>Showing {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
                            <span>Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings; 