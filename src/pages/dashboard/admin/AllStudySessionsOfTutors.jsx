import React, { useState } from 'react';
import { FaBook, FaCheck, FaTimes, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
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
        <div className="max-w-4xl mx-auto p-4">
            <DashboardHeading icon={FaBook} title='All Study Sessions' />
            {/* Status Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-2 justify-center">
                {FILTERS.map(f => (
                    <button
                        key={f.value}
                        className={`cursor-pointer px-3 py-1 rounded-md border transition ${filter === f.value
                            ? 'bg-primary text-white border-primary'
                            : ' text-base-content border-base-300 bg-primary/6'
                            }`}
                        onClick={() => setFilter(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            {/* Paid/Free Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {PAID_FILTERS.map(f => (
                    <button
                        key={f.value}
                        className={`cursor-pointer px-3 py-1 rounded-md border transition ${paidFilter === f.value
                            ? 'bg-primary text-white border-primary'
                            : ' text-base-content border-base-300 bg-primary/6'
                            }`}
                        onClick={() => setPaidFilter(f.value)}
                    >
                        {f.label}
                    </button>
                ))}
            </div>
            <div className="overflow-x-auto">
                {filteredSessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
                        <FaInfoCircle className="text-4xl text-base-content/50 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No study sessions found.</h2>
                        <p className="text-base-content/70">There are currently no study sessions to display.</p>
                    </div>
                ) : (
                    <table className="min-w-full bg-base-100 shadow rounded-lg">
                        <thead>
                            <tr className="bg-base-300/80 rounded-md">
                                <th className="py-3 px-4 text-left font-semibold">Image</th>
                                <th className="py-3 px-4 text-left font-semibold">Title</th>
                                <th className="py-3 px-4 text-left font-semibold">Tutor</th>
                                <th className="py-3 px-4 text-left font-semibold">Status</th>
                                <th className="py-3 px-4 text-left font-semibold">Type</th>
                                <th className="py-3 px-4 text-left font-semibold">Reg. Fee</th>
                                <th className="py-3 px-4 text-left font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSessions.map(session => (
                                <tr key={session._id} className="border-b border-base-content/10 hover:bg-base-200/50 transition">
                                    <td className="py-2 px-4">
                                        {session.sessionImage ? (
                                            <img
                                                src={session.sessionImage}
                                                alt="Session"
                                                className="w-14 h-14 object-cover rounded-md border border-base-content/10 shadow-sm"
                                            />
                                        ) : (
                                            <span className="w-14 h-14 bg-base-200 rounded-md flex items-center justify-center text-base-content/40">—</span>
                                        )}
                                    </td>
                                    <td className="py-2 px-4 font-medium text-base-content">{session.title?.length > 20 ? session.title.slice(0, 20) + '...' : session.title}</td>
                                    <td className="py-2 px-4">{session.tutorName || session.tutorEmail}</td>
                                    <td className="py-2 px-4">
                                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold capitalize ${session.status === 'approved' ? 'bg-green-100 text-green-700' : session.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{session.status}</span>
                                    </td>
                                    <td className="py-2 px-4">{session.paid ? 'Paid' : 'Free'}</td>
                                    <td className="py-2 px-4">{session.paid ? session.registrationFee : 0} TK</td>
                                    <td className="py-2 px-4 flex gap-2 mt-4 items-center">
                                        {session.status === 'pending' && (
                                            <>
                                                <FaCheck
                                                    className="text-green-500 text-lg cursor-pointer"
                                                    title="Approve"
                                                    onClick={() => {
                                                        setApproveModal({ open: true, session });
                                                        setIsPaid(!!session.paid);
                                                        setRegistrationFee(session.registrationFee || 0);
                                                    }}
                                                />
                                                <FaTimes
                                                    className="text-red-500 text-lg cursor-pointer"
                                                    title="Reject"
                                                    onClick={() => setRejectModal({ open: true, session })}
                                                />
                                            </>
                                        )}
                                        {session.status === 'approved' && (
                                            <>
                                                <button onClick={() => navigate(`/dashboard/admin/sessions/${session._id}`)}>
                                                    <FaEdit className='text-blue-500 text-lg' title="Update" />
                                                </button>
                                                <FaTrash
                                                    className="text-red-500 text-[16px] cursor-pointer"
                                                    title="Delete"
                                                    onClick={() => handleDelete(session._id)}
                                                />
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

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