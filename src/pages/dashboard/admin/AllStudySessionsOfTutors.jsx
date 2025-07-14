import React, { useState } from 'react';
import { FaBook, FaCheck, FaTimes, FaEdit, FaTrash, FaInfoCircle, FaSearch, FaUser, FaCalendarAlt, FaMoneyBill, FaCheckCircle, FaRegClock, FaTimesCircle } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/ui/Spinner';
import Swal from 'sweetalert2';
import ApproveSessionModal from '../../../components/modals/ApproveSessionModal';
import RejectSessionModal from '../../../components/modals/RejectSessionModal';
import { Link, useNavigate } from 'react-router';

const AllStudySessionsOfTutors = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [approveModal, setApproveModal] = useState({ open: false, session: null });
    const [rejectModal, setRejectModal] = useState({ open: false, session: null });
    const [isPaid, setIsPaid] = useState(false);
    const [registrationFee, setRegistrationFee] = useState(0);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionFeedback, setRejectionFeedback] = useState('');
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);
    const FILTERS = [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
    ];
    const [filter, setFilter] = useState('all');
    const PAID_FILTERS = [
        { label: 'All', value: 'all' },
        { label: 'Paid', value: 'paid' },
        { label: 'Free', value: 'free' },
    ];
    const [paidFilter, setPaidFilter] = useState('all');

    // Fetch all sessions
    const { data: sessions = [], isLoading, refetch } = useQuery({
        queryKey: ['allSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data;
        }
    });

    // Filter sessions based on selected filter and paid/free
    const filteredSessions = sessions.filter(session => {
        const statusMatch = filter === 'all' || session.status === filter;
        const paidMatch = paidFilter === 'all' || (paidFilter === 'paid' ? session.paid : !session.paid);
        return statusMatch && paidMatch;
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
            currency: 'BDT'
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

    // Approve session mutation
    const approveSession = useMutation({
        mutationFn: async ({ id, paid, registrationFee }) => {
            setLoadingApprove(true);
            return axiosSecure.patch(`/sessions/${id}/status`, {
                status: 'approved',
                paid,
                registrationFee: paid ? registrationFee : 0
            });
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Session approved!',
                showConfirmButton: false,
                timer: 1500
            });
            setApproveModal({ open: false, session: null });
            setLoadingApprove(false);
            refetch();
        },
        onError: () => { setLoadingApprove(false); Swal.fire({ icon: 'error', title: 'Failed to approve session', showConfirmButton: false, timer: 1500 }); }
    });

    // Reject session mutation
    const rejectSession = useMutation({
        mutationFn: async ({ id, reason, feedback }) => {
            setLoadingReject(true);
            return axiosSecure.patch(`/sessions/${id}/status`, { status: 'rejected', reason, feedback });
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'info',
                title: 'Session rejected.',
                showConfirmButton: false,
                timer: 1500
            });
            setRejectModal({ open: false, session: null });
            setRejectionReason('');
            setRejectionFeedback('');
            setLoadingReject(false);
            refetch();
        },
        onError: () => { setLoadingReject(false); Swal.fire({ icon: 'error', title: 'Failed to reject session', showConfirmButton: false, timer: 1500 }); }
    });

    // Delete session mutation
    const deleteSession = useMutation({
        mutationFn: async (id) => {
            return axiosSecure.delete(`/sessions/${id}`);
        },
        onSuccess: () => {
            Swal.fire({
                title: 'Deleted!',
                text: 'Session has been deleted.',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
            });
            refetch();
        },
        onError: () => Swal.fire({ icon: 'error', title: 'Failed to delete session', showConfirmButton: false, timer: 1500 })
    });

    const handleDelete = (sessionId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSession.mutate(sessionId);
            }
        });
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="space-y-6">
            <DashboardHeading icon={FaBook} title='All Study Sessions' />

            {/* Filter Section */}
            <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                    {/* Status Filter Buttons */}
                    <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-base-content/70 mr-2">Status:</span>
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

                    {/* Paid/Free Filter Buttons */}
                    <div className="flex items-center flex-wrap gap-2">
                        <span className="text-sm font-medium text-base-content/70 mr-2">Type:</span>
                        {PAID_FILTERS.map(f => (
                            <button
                                key={f.value}
                                className={`cursor-pointer px-3 py-1 rounded-md border transition text-sm ${paidFilter === f.value
                                        ? 'bg-primary text-white border-primary'
                                        : 'text-base-content border-base-300 bg-base-200 hover:bg-base-300'
                                    }`}
                                onClick={() => setPaidFilter(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            {filteredSessions.length === 0 ? (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                        <FaInfoCircle className="text-6xl text-base-content/30 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No study sessions found</h2>
                        <p className="text-base-content/70 mb-4">There are currently no study sessions matching your filters.</p>
                        <button
                            onClick={() => { setFilter('all'); setPaidFilter('all'); }}
                            className="btn btn-primary btn-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-base-200 px-6 py-4 border-b border-base-300">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Study Sessions Management</h3>
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
                                    <th className="font-semibold">Tutor</th>
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
                                                <div>
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
                                            <div className="flex items-center gap-2">
                                                <FaUser className="text-primary text-sm" />
                                                <span className="font-medium">
                                                    {session.tutorName || session.tutorEmail}
                                                </span>
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
                                            {getStatusBadge(session.status)}
                                        </td>
                                        <td>
                                            <div className="flex justify-center gap-2">
                                                {session.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setApproveModal({ open: true, session });
                                                                setIsPaid(!!session.paid);
                                                                setRegistrationFee(session.registrationFee || 0);
                                                            }}
                                                            className="btn btn-sm btn-success btn-outline"
                                                            title="Approve Session"
                                                        >
                                                            <FaCheck />
                                                        </button>
                                                        <button
                                                            onClick={() => setRejectModal({ open: true, session })}
                                                            className="btn btn-sm btn-error btn-outline"
                                                            title="Reject Session"
                                                        >
                                                            <FaTimes />
                                                        </button>
                                                    </>
                                                )}
                                                {session.status === 'approved' && (
                                                    <>
                                                        <button
                                                            onClick={() => navigate(`/dashboard/admin/sessions/${session._id}`)}
                                                            className="btn btn-sm btn-primary btn-outline"
                                                            title="Edit Session"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(session._id)}
                                                            className="btn btn-sm btn-error btn-outline"
                                                            title="Delete Session"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                                {session.status === 'rejected' && (
                                                    <button
                                                        onClick={() => setRejectModal({ open: true, session })}
                                                        className="btn btn-sm btn-warning btn-outline"
                                                        title="View Rejection Details"
                                                    >
                                                        <FaInfoCircle />
                                                    </button>
                                                )}
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

            {/* Approve Modal */}
            <ApproveSessionModal
                open={approveModal.open}
                onClose={() => setApproveModal({ open: false, session: null })}
                onApprove={() => approveSession.mutate({ id: approveModal.session._id, paid: isPaid, registrationFee })}
                isPaid={isPaid}
                setIsPaid={setIsPaid}
                amount={registrationFee}
                setAmount={setRegistrationFee}
                loading={loadingApprove}
            />

            {/* Reject Modal */}
            <RejectSessionModal
                open={rejectModal.open}
                onClose={() => {
                    setRejectModal({ open: false, session: null });
                    setRejectionReason('');
                    setRejectionFeedback('');
                }}
                onReject={() => rejectSession.mutate({ id: rejectModal.session._id, reason: rejectionReason, feedback: rejectionFeedback })}
                reason={rejectionReason}
                setReason={setRejectionReason}
                feedback={rejectionFeedback}
                setFeedback={setRejectionFeedback}
                loading={loadingReject}
            />
        </div>
    );
};

export default AllStudySessionsOfTutors;