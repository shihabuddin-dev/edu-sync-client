import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Spinner from '../../../components/ui/Spinner';
import { FaUser, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';

const ITEMS_PER_PAGE = 5;

const AllStudent = () => {
    const axiosSecure = useAxiosSecure();
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['all-students', page],
        queryFn: async () => {
            const res = await axiosSecure.get(`/students?page=${page}&limit=${ITEMS_PER_PAGE}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    const students = data?.students || [];
    const totalPages = data?.totalPages || 1;
    const totalItems = data?.totalItems || 0;

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <Spinner />
                <p className="mt-4 text-base-content/70">Loading students...</p>
            </div>
        </div>
    );

    if (isError) return (
        <div className="text-center py-8">
            <div className="text-error">
                <h2 className="text-2xl font-bold mb-2">Error Loading Students</h2>
                <p>{error.message}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <DashboardHeading title="All Students" icon={FaUsers} />
            <div className="bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden">
                {/* Table Header */}
                <div className="bg-base-200 px-4 sm:px-6 py-4 border-b border-base-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h3 className="text-lg font-semibold">Student List</h3>
                        <div className="flex items-center gap-2 text-sm text-base-content/70">
                            <FaUser />
                            <span>{totalItems} student{totalItems !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full min-w-[800px]">
                        <thead className="bg-base-200">
                            <tr>
                                <th className="font-semibold text-center">#</th>
                                <th className="font-semibold text-center">Image</th>
                                <th className="font-semibold">Name</th>
                                <th className="font-semibold">Email</th>
                                <th className="font-semibold">Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student, idx) => (
                                <tr key={student._id} className="hover:bg-base-50">
                                    <td className="text-center font-bold text-base-content/80">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                                    <td className="text-center">
                                        <img
                                            src={student.photoURL || '/default-avatar.png'}
                                            alt={student.name || 'Student'}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary shadow mx-auto"
                                            onError={e => { e.target.src = '/default-avatar.png'; }}
                                        />
                                    </td>
                                    <td>
                                        <span className="font-medium text-base-content">{student.name || 'Unknown'}</span>
                                    </td>
                                    <td>
                                        <span className="text-sm text-base-content/80">{student.email}</span>
                                    </td>
                                    <td>
                                        <span className="flex items-center gap-1 text-sm text-base-content/70">
                                            <FaCalendarAlt className="text-primary" />
                                            {student.created_at
                                                ? new Date(student.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                                                : 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-2 py-4 bg-base-100 border-t border-base-300">
                    <button
                        className="btn btn-sm btn-outline hover:btn-primary"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </button>
                    <span className="px-2 text-base-content/70">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="btn btn-sm btn-outline hover:btn-primary"
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        Next
                    </button>
                </div>
                {/* Table Footer */}
                <div className="bg-base-200 px-4 sm:px-6 py-3 border-t border-base-300">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-base-content/70">
                        <span>Showing {students.length} student{students.length !== 1 ? 's' : ''}</span>
                        <span className="text-xs sm:text-sm">Last updated: {new Date().toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllStudent;