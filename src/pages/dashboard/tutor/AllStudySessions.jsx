import React, { useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { FaBook, FaRedo } from 'react-icons/fa';
import Spinner from '../../../components/ui/Spinner';
import DashboardHeading from '../../../components/shared/DashboardHeading';

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

    if (isLoading) return <Spinner />;

    // Filter sessions based on selected filter
    const filteredSessions = filter === 'all'
        ? sessions
        : sessions.filter(session => session.status === filter);

    return (
        <div className="max-w-5xl mx-auto p-4">
            <DashboardHeading icon={FaBook} title='All My Study Sessions' />
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
                        <tr className="bg-base-200">
                            <th className="py-3 px-4 text-left">Image</th>
                            <th className="py-3 px-4 text-left">Title</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
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
                                <td className="py-2 px-4">
                                    {session.status === 'rejected' ? (
                                        <button
                                            className="btn btn-xs btn-warning"
                                            onClick={() => requestApproval(session._id)}
                                            disabled={isResubmitting}
                                        >
                                            <FaRedo /><span className='hidden md:inline'> Request Again</span>
                                        </button>
                                    ) : (
                                        <span className="text-gray-400">—</span>
                                    )}
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