import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    FaBook,
    FaRedo,
    FaEdit,
    FaTrash,
    FaSearch,
    FaCalendarAlt,
    FaMoneyBill,
    FaCheckCircle,
    FaRegClock,
    FaTimesCircle,
    FaInfoCircle
} from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
];

const MyAllStudySessions = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    // No need for modal state, use SweetAlert2

    // Fetch all sessions for this tutor
    const { data: sessions = [], refetch, isLoading } = useQuery({
        queryKey: ['sessions', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data;
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

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return <span className="badge badge-success badge-sm rounded gap-1"><FaCheckCircle /> Approved</span>;
            case 'pending':
                return <span className="badge badge-warning badge-sm rounded gap-1"><FaRegClock /> Pending</span>;
            case 'rejected':
                return <span className="badge badge-error badge-sm rounded gap-1"><FaTimesCircle /> Rejected</span>;
            default:
                return <span className="badge badge-neutral badge-sm rounded gap-1">Unknown</span>;
        }
    };

    // Mutation for resubmitting a rejected session
    const { mutate: requestApproval, isLoading: isResubmitting } = useMutation({
        mutationFn: async (sessionId) => {
            await axiosSecure.patch(`/sessions/${sessionId}/resubmit`);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Session Resubmitted!',
                text: 'Your session has been resubmitted for approval.',
                showConfirmButton: false,
                timer: 1500
            });
            refetch();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Resubmit',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                showConfirmButton: true
            });
        }
    });

    // Mutation for deleting a session
    const { mutate: deleteSession, isLoading: isDeleting } = useMutation({
        mutationFn: async (sessionId) => {
            await axiosSecure.delete(`/sessions/${sessionId}/own`);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Session has been deleted.',
                showConfirmButton: false,
                timer: 1500
            });
            refetch();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'Failed to Delete',
                text: error.response?.data?.message || 'Something went wrong. Please try again.',
                showConfirmButton: true
            });
        }
    });

    if (isLoading) return <Spinner />;

    // Filter sessions based on selected filter
    const filteredSessions = filter === 'all'
        ? sessions
        : sessions.filter(session => session.status === filter);

    // Delete confirmation
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this Session!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSession(id);
            }
        });
    };

    return (
        <>
            <div className="space-y-6">
                <DashboardHeading icon={FaBook} title='My Study Sessions' />

                {/* Filter Section */}
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-4">
                    <div className="flex items-center flex-wrap gap-2 justify-center">
                        <span className="text-sm font-medium text-base-content/70 mr-2">Filter by Status:</span>
                        {FILTERS.map(f => (
                            <button
                                key={f.value}
                                className={`cursor-pointer px-3 py-1 rounded-md border transition text-sm ${filter === f.value
                                    ? 'bg-primary text-white border-primary'
                                    : 'text-base-content border-base-300 bg-base-200 hover:bg-base-300'
                                    }`}
                                onClick={() => setFilter(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table Section */}
                {filteredSessions.length === 0 ? (
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <FaInfoCircle className="text-6xl text-base-content/30 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No sessions found</h2>
                            <p className="text-base-content/70 mb-4">
                                {filter === 'all'
                                    ? "You haven't created any study sessions yet."
                                    : `No ${filter} sessions found.`
                                }
                            </p>
                            {filter !== 'all' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="btn btn-primary btn-sm"
                                >
                                    View All Sessions
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold">My Study Sessions</h3>
                                <div className="flex items-center gap-2 text-sm text-base-content/70">
                                    <FaSearch />
                                    <span>{filteredSessions.length} session{filteredSessions.length !== 1 ? 's' : ''}</span>
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
                                        <th className="font-semibold">Registration Period</th>
                                        <th className="font-semibold">Fee</th>
                                        <th className="font-semibold">Status</th>
                                        {/* <th className="font-semibold">Created</th> */}
                                        <th className="font-semibold text-center">Actions</th>
                                    </tr>
                                </thead>
                                {/* Table Body */}
                                <tbody>
                                    {filteredSessions.map(session => (
                                        <tr key={session._id} className="hover:bg-base-50">
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    {session.sessionImage ? (
                                                        <img
                                                            src={session.sessionImage}
                                                            alt={session.title}
                                                            className="w-12 h-12 object-cover rounded-md border-2 border-primary"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-base-200 rounded-md flex items-center justify-center">
                                                            <FaBook className="text-base-content/40" />
                                                        </div>
                                                    )}
                                                    <div className='hidden md:inline'>
                                                        <div className="font-medium">
                                                            {session.title?.length > 15 ? session.title.slice(0, 15) + '...' : session.title}
                                                        </div>
                                                        <div className="text-sm text-base-content/70">
                                                            {session.duration || 'Duration TBD'}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <FaCalendarAlt className="text-primary" />
                                                        <span>
                                                            {session.registrationStart
                                                                ? formatDate(session.registrationStart)
                                                                : 'TBD'
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-base-content/70">
                                                        <span>to</span>
                                                        <span>
                                                            {session.registrationEnd
                                                                ? formatDate(session.registrationEnd)
                                                                : 'TBD'
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1">
                                                    <FaMoneyBill className={session.paid ? "text-success" : "text-base-content/50"} />
                                                    <span className="font-medium">
                                                        {session.paid ? formatCurrency(session.registrationFee) : 'Free'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex flex-col gap-2">
                                                    {getStatusBadge(session.status)}
                                                    {session.status === 'rejected' && (
                                                        <button
                                                            className="badge badge-error badge-outline rounded text-xs cursor-pointer w-fit mt-1"
                                                            onClick={() => {
                                                                Swal.fire({
                                                                    icon: 'info',
                                                                    title: 'Rejection Details',
                                                                    html: `<div style='text-align:left;'>
                                                                        <div><b>Reason:</b> ${session.rejectionReason || 'No reason provided.'}</div>
                                                                        ${session.rejectionFeedback ? `<div style='margin-top:8px;'><b>Feedback:</b> ${session.rejectionFeedback}</div>` : ''}
                                                                    </div>`,
                                                                    confirmButtonText: 'Close',
                                                                    customClass: { popup: 'swal2-border-radius' }
                                                                });
                                                            }}
                                                        >
                                                            <span className='hidden md:inline'> View Rejection Details</span>
                                                            <span className='md:hidden'>Rejection</span>
                                                        </button>
                                                    )}
                                                    {session.status === 'rejected' && (
                                                        <button
                                                            className="btn btn-xs btn-warning btn-outline gap-1"
                                                            onClick={() => requestApproval(session._id)}
                                                            disabled={isResubmitting}
                                                        >
                                                            <FaRedo />
                                                            Resubmit
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => navigate(`/dashboard/tutor/update-session/${session._id}`)}
                                                        className="btn btn-sm btn-primary btn-outline"
                                                        title="Edit Session"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(session._id)}
                                                        disabled={isDeleting}
                                                        className="btn btn-sm btn-error btn-outline"
                                                        title="Delete Session"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer */}
                        <div className="bg-base-200 px-6 py-3 border-t border-base-300">
                            <div className="flex flex-wrap items-center justify-between text-sm text-base-content/70">
                                <span>Showing {filteredSessions.length} of {sessions.length} sessions</span>
                                <span>Last updated: {new Date().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MyAllStudySessions;