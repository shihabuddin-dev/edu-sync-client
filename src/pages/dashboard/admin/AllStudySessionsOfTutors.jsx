import React, { useState } from 'react';
import { FaBook, FaCheck, FaTimes, FaEdit, FaTrash, FaInfoCircle } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery, useMutation } from '@tanstack/react-query';
import Spinner from '../../../components/ui/Spinner';
import Swal from 'sweetalert2';
import ApproveSessionModal from '../../../components/modals/ApproveSessionModal';
import RejectSessionModal from '../../../components/modals/RejectSessionModal';
import { Link } from 'react-router';


const AllStudySessionsOfTutors = () => {
    const axiosSecure = useAxiosSecure();
    const [approveModal, setApproveModal] = useState({ open: false, session: null });
    const [rejectModal, setRejectModal] = useState({ open: false, session: null });
    const [isPaid, setIsPaid] = useState(false);
    const [registrationFee, setRegistrationFee] = useState(0);
    const [rejectionReason, setRejectionReason] = useState('');
    const [rejectionFeedback, setRejectionFeedback] = useState('');
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [loadingReject, setLoadingReject] = useState(false);

    // Fetch all sessions
    const { data: sessions = [], isLoading, refetch } = useQuery({
        queryKey: ['allSessions'],
        queryFn: async () => {
            const res = await axiosSecure.get('/sessions');
            return res.data;
        }
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
                text: 'Your file has been deleted.',
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
        <di>
            <DashboardHeading icon={FaBook} title='All Study Sessions' />
            <div className="overflow-x-auto mt-6">
                {sessions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[30vh] text-center">
                        <FaInfoCircle className="text-4xl text-base-content/50 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No study sessions found.</h2>
                        <p className="text-base-content/70">There are currently no study sessions to display.</p>
                    </div>
                ) : (
                    <table className="table w-full max-w-4xl mx-auto rounded-md bg-base-100 shadow border border-base-200">
                        <thead className="bg-base-200 rounded-md">
                            <tr>
                                <th className="rounded-md">Title</th>
                                <th className="rounded-md">Tutor</th>
                                <th className="rounded-md">Status</th>
                                <th className="rounded-md">Type</th>
                                <th className="rounded-md">Amount</th>
                                <th className="rounded-md">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map(session => (
                                <tr key={session._id} className="hover rounded-md">
                                    <td className="rounded-md">{session.title?.length > 20 ? session.title.slice(0, 20) + '...' : session.title}</td>
                                    <td className="rounded-md">{session.tutorName || session.tutorEmail}</td>
                                    <td className="rounded">
                                        <span className={`badge rounded-md ${session.status === 'approved' ? 'badge-success' : session.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>{session.status}</span>
                                    </td>
                                    <td className="rounded-md">{session.paid ? 'Paid' : 'Free'}</td>
                                    <td className="rounded-md">{session.paid ? session.registrationFee : 0}</td>
                                    <td className="flex gap-2 rounded-md items-center">
                                        {session.status === 'pending' && (
                                            <>
                                                <FaCheck
                                                    className="text-green-500 text-lg"
                                                    title="Approve"
                                                    onClick={() => {
                                                        setApproveModal({ open: true, session });
                                                        setIsPaid(!!session.paid);
                                                        setRegistrationFee(session.registrationFee || 0);
                                                    }}
                                                />
                                                <FaTimes
                                                    className="text-red-500 text-lg"
                                                    title="Reject"
                                                    onClick={() => setRejectModal({ open: true, session })}
                                                />
                                            </>
                                        )}
                                        {session.status === 'approved' && (
                                            <>
                                                <Link to={session._id}><FaEdit
                                                    className="text-blue-500 text-lg"
                                                    title="Update"
                                                /></Link>
                                                <FaTrash
                                                    className="text-red-500 text-[16px]"
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
        </di>
    );
};

export default AllStudySessionsOfTutors;