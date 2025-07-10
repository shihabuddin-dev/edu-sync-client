import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FaBook, FaRedo, FaEdit, FaTrash } from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { useNavigate } from 'react-router';

const statusColors = {
    approved: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    default: 'bg-gray-100 text-gray-700',
};

const FILTERS = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Approved', value: 'approved' },
    { label: 'Rejected', value: 'rejected' },
];

const AllStudySessions = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();

    // Fetch all sessions for this tutor
    const { data: sessions = [], refetch, isLoading } = useQuery({
        queryKey: ['sessions', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/sessions?email=${user.email}`);
            return res.data;
        }
    });

    // Mutation for resubmitting a rejected session
    const { mutate: requestApproval, isLoading: isResubmitting } = useMutation({
        mutationFn: async (sessionId) => {
            await axiosSecure.patch(`/sessions/${sessionId}/status`, { status: 'pending' });
        },
        onSuccess: () => {
            refetch();
        }
    });

    // Mutation for deleting a session
    const { mutate: deleteSession, isLoading: isDeleting } = useMutation({
        mutationFn: async (sessionId) => {
            await axiosSecure.delete(`/sessions/${sessionId}`);
        },
        onSuccess: () => {
            refetch();
        }
    });

    if (isLoading) return <Spinner />;

    // Filter sessions based on selected filter
    const filteredSessions = filter === 'all'
        ? sessions
        : sessions.filter(session => session.status === filter);

    // Delete confirmation
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this session?')) {
            deleteSession(id);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <DashboardHeading icon={FaBook} title='My Study Sessions' />
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
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
            <div className="overflow-x-auto">
                <table className="min-w-full bg-base-100 shadow rounded-lg">
                    <thead>
                        <tr className="bg-base-300/80 rounded-md">
                            <th className="py-3 px-4 text-left font-semibold">Image</th>
                            <th className="py-3 px-4 text-left font-semibold">Title</th>
                            <th className="py-3 px-4 text-left font-semibold">Status</th>
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
                                <td className="py-2 px-4 font-medium text-base-content">{session.title}</td>
                                <td className="py-2 px-4">
                                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold capitalize ${statusColors[session.status] || statusColors.default}`}>
                                        {session.status}
                                    </span>
                                </td>
                                <td className="py-2 px-4 flex gap-2 items-center">
                                    {session.status === 'rejected' && (
                                        <button
                                            className="btn btn-xs btn-warning"
                                            onClick={() => requestApproval(session._id)}
                                            disabled={isResubmitting}
                                        >
                                            <FaRedo /><span className='hidden md:inline'> Request Again</span>
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-xs btn-info"
                                        onClick={() => navigate(`/dashboard/tutor/update-session/${session._id}`)}
                                    >
                                        <FaEdit /><span className='hidden md:inline'> Update</span>
                                    </button>
                                    <button
                                        className="btn btn-xs btn-error"
                                        onClick={() => handleDelete(session._id)}
                                        disabled={isDeleting}
                                    >
                                        <FaTrash /><span className='hidden md:inline'> Delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredSessions.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-4 text-base-content/60">No sessions found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllStudySessions;