import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import Swal from 'sweetalert2';
import {
    FaCalendarAlt,
    FaClock,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaRegClock,
    FaMoneyBill,
    FaEye,
    FaSearch,
    FaBan,
    FaChevronDown,
    FaList,
    FaCreditCard,
    FaHourglassHalf
} from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import { Link } from 'react-router';
import Button from '../../../components/ui/Button';

const MyBookings = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [filter, setFilter] = useState('all');

    const { data: bookings = [], isLoading, isError, error, refetch } = useQuery({
        queryKey: ['student-bookings', user?.email],
        queryFn: async () => {
            try {
                const res = await axiosSecure(`/bookedSessions/student/${user.email}`);
                return res.data;
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    // Forbidden: clear bookings and show message
                    return [];
                }
                throw error;
            }
        },
        enabled: !!user?.email,
    });

    // Filter bookings based on status
    const filteredBookings = React.useMemo(() => {
        if (filter === 'all') return bookings;
        return bookings.filter(booking => booking.paymentStatus === filter);
    }, [bookings, filter]);

    // Cancel booking mutation
    const { mutate: cancelBooking, isLoading: isCancelling } = useMutation({
        mutationFn: async (bookingId) => {
            const res = await axiosSecure.delete(`/bookedSessions/${bookingId}/cancel`);
            return res.data;
        },
        onSuccess: (data) => {
            let refundMessage = '';

            if (data.refund) {
                if (data.refund.error) {
                    // Refund failed but booking was cancelled
                    refundMessage = `
                        <div class="text-left">
                            <p>Your booking has been cancelled and removed from your history.</p>
                            <div class="alert alert-warning mt-3">
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                                    <div>
                                        <h3 class="font-bold">Refund Issue</h3>
                                        <div class="text-xs">The refund could not be processed automatically. Please contact support with your booking details for manual refund processing.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Refund successful
                    refundMessage = `
                        <div class="text-left">
                            <p>Your booking has been cancelled and removed from your history.</p>
                            <p><strong>Refund Status:</strong> ${data.refund.status}</p>
                            <p><strong>Refund Amount:</strong> $${(data.refund.amount / 100).toFixed(2)}</p>
                            <p><strong>Refund ID:</strong> <code>${data.refund.refundId}</code></p>
                            <p class="text-sm text-gray-600 mt-2">The refund will be processed to your original payment method within 5-10 business days.</p>
                        </div>
                    `;
                }
            } else {
                refundMessage = `
                    <div class="text-left">
                        <p>Your booking has been cancelled and removed from your history.</p>
                        <p>No refund was processed for this booking.</p>
                    </div>
                `;
            }

            Swal.fire({
                icon: data.refund?.error ? 'warning' : 'success',
                title: data.refund?.error ? 'Booking Cancelled (Refund Issue)' : 'Booking Cancelled!',
                html: refundMessage,
                confirmButtonText: 'OK'
            });
            refetch();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Cancellation Failed',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                confirmButtonText: 'OK'
            });
        }
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

    // Handle booking cancellation
    const handleCancelBooking = (booking) => {
        // Check if session has already started
        if (booking.sessionDetails?.classStart) {
            const sessionStart = new Date(booking.sessionDetails.classStart);
            const now = new Date();
            if (now >= sessionStart) {
                Swal.fire({
                    icon: 'error',
                    title: 'Cannot Cancel',
                    text: 'Cannot cancel a session that has already started.',
                    confirmButtonText: 'OK'
                });
                return;
            }
        }

        const refundText = booking.paymentStatus === 'completed' && booking.amount > 0
            ? `You will receive a refund of ${formatCurrency(booking.amount)} to your original payment method.`
            : 'No refund will be processed for this booking.';

        Swal.fire({
            title: 'Cancel Booking?',
            html: `
                <div class="text-left">
                    <p>Are you sure you want to cancel this booking?</p>
                    <p><strong>Session:</strong> ${booking.sessionDetails?.title || 'Unknown'}</p>
                    <p><strong>Date:</strong> ${booking.sessionDetails?.classStart ? formatDate(booking.sessionDetails.classStart) : 'TBD'}</p>
                    <p class="text-sm text-gray-600 mt-2">${refundText}</p>
                    <p class="text-sm text-red-600 mt-2"><strong>Warning:</strong> This action will permanently remove the booking from your history.</p>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!',
            cancelButtonText: 'Keep Booking',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return cancelBooking(booking._id);
            },
            allowOutsideClick: () => !isCancelling
        });
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
                <p>
                    {error.response?.status === 403
                        ? "You are not authorized to view these bookings."
                        : error.message}
                </p>
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

            {filteredBookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-base-content/50">
                        <MdMenuBook className="text-6xl mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                            {filter === 'all' ? 'No Bookings Yet' : `No ${filter} Bookings`}
                        </h3>
                        <p className="mb-4">
                            {filter === 'all'
                                ? "You haven't booked any study sessions yet."
                                : `You don't have any ${filter === 'completed' ? 'paid' : filter} bookings.`
                            }
                        </p>
                        {filter !== 'all' && (
                            <Button
                                onClick={() => setFilter('all')}
                                className="btn btn-sm"
                                title="Clear filter"
                            >
                                Clear Filter
                            </Button>
                        )}
                        {filter === 'all' && (
                            <Link to='/study-sessions'>
                                <Button
                                >
                                    Browse Sessions
                                </Button></Link>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
                                        {/* Table Header */}
                    <div className="bg-base-200 px-4 sm:px-6 py-4 border-b border-base-300">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h3 className="text-lg font-semibold">Booking History</h3>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                {/* Filter */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                                    <span className="text-sm text-base-content/70 whitespace-nowrap">Filter:</span>
                                    <div className="flex flex-wrap gap-1 text-primary">
                                        <button
                                            onClick={() => setFilter('all')}
                                            className={`btn btn-xs ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                                        >
                                            <FaList className="text-xs" />
                                            <span className="hidden sm:inline">All</span>
                                        </button>
                                        <button
                                            onClick={() => setFilter('completed')}
                                            className={`btn btn-xs ${filter === 'completed' ? 'btn-primary' : 'btn-outline'}`}
                                        >
                                            <FaCreditCard className="text-xs" />
                                            <span className="hidden sm:inline">Paid</span>
                                        </button>
                                        <button
                                            onClick={() => setFilter('pending')}
                                            className={`btn btn-xs ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
                                        >
                                            <FaHourglassHalf className="text-xs" />
                                            <span className="hidden sm:inline">Pending</span>
                                        </button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <FaSearch />
                                    <span>{filteredBookings.length} booking{filteredBookings.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full min-w-[800px]">
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
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-base-50">
                                        <td>
                                            <div className="font-medium">
                                                {booking.sessionDetails?.title.slice(0,15) || 'Session Title'}
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
                                                <div className="hidden lg:flex items-center gap-1 text-xs text-base-content/70">
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
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/dashboard/student/my-bookings/${booking._id}`}
                                                    className="btn btn-sm btn-outline btn-primary gap-2"
                                                >
                                                    <FaEye />
                                                    Details
                                                </Link>
                                                <button
                                                    onClick={() => handleCancelBooking(booking)}
                                                    disabled={isCancelling}
                                                    className="btn btn-sm btn-outline btn-error gap-2"
                                                >
                                                    {isCancelling ? (
                                                        <div className="loading loading-spinner loading-xs"></div>
                                                    ) : (
                                                        <FaBan />
                                                    )}
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Footer */}
                    <div className="bg-base-200 px-4 sm:px-6 py-3 border-t border-base-300">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-base-content/70">
                            <span>Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
                            <span className="text-xs sm:text-sm">Last updated: {new Date().toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings; 