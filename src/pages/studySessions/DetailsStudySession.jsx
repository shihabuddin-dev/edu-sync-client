import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';

const DetailsStudySession = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();

    const { data: session, isLoading, isError, error } = useQuery({
        queryKey: ['session-details', id],
        queryFn: async () => {
            const res = await axiosInstance(`/sessions/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) return <div className="text-center py-8">Loading...</div>;
    if (isError) return <div className="text-center py-8 text-error">Error: {error.message}</div>;
    if (!session) return <div className="text-center py-8">Session not found.</div>;
    return (
        <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded shadow">
            <h2 className="text-2xl font-bold mb-4">{session.title}</h2>
            <p className="mb-4 text-base-content/80">{session.description}</p>
            {/* Add more fields as needed */}
            <div className="flex gap-4 mt-4">
                <span className="badge badge-primary">Tutor: {session.tutorName}</span>
                <span className="badge badge-secondary">Duration: {session.duration}</span>
            </div>
        </div>
    );
};

export default DetailsStudySession;