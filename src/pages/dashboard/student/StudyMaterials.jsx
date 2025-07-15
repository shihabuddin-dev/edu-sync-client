import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { FaBook, FaDownload, FaExternalLinkAlt, FaFolderOpen } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';

const StudyMaterials = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedSessionId, setSelectedSessionId] = useState(null);

    // 1. Fetch all booked sessions for the student
    const { data: bookings = [], isLoading: loadingBookings } = useQuery({
        queryKey: ['student-bookings', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/bookedSessions/student/${user.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    // 2. Fetch materials for the selected session
    const { data: materials = [], isLoading: loadingMaterials } = useQuery({
        queryKey: ['materials', selectedSessionId],
        queryFn: async () => {
            if (!selectedSessionId) return [];
            const res = await axiosSecure.get(`/materials?sessionId=${selectedSessionId}`);
            return res.data;
        },
        enabled: !!selectedSessionId,
    });

    // Download image helper
    const handleDownload = async (url, title) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = title || 'material-image';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            alert('Failed to download image.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-8 px-2 sm:px-4">
             <title>Study Materials | Edu Sync</title>
            <DashboardHeading icon={FaFolderOpen} title='Study Materials' />
            {/* 1. Show all booked sessions */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-base-content">Your Booked Sessions</h3>
                {loadingBookings ? (
                    <div className="text-base-content/70">Loading sessions...</div>
                ) : bookings.length === 0 ? (
                    <div className="text-base-content/60">You have no booked sessions.</div>
                ) : (
                    <div className="flex flex-wrap gap-2 sm:gap-3 w-full">
                        {bookings.map((booking) => (
                            <button
                                key={booking.sessionId}
                                className={`w-full btn sm:w-auto mb-2 sm:mb-0 px-4 py-2  justify-center ${selectedSessionId === booking.sessionId ? 'bg-primary text-primary-content border-primary rounded-md' : ' text-base-content border-base-300 bg-primary/10'}`}
                                onClick={() => setSelectedSessionId(booking.sessionId)}
                            >
                                <FaBook />
                                {booking.sessionDetails?.title.slice(0, 20) || 'Session'}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {/* 2. Show materials for selected session */}
            {selectedSessionId && (
                <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-base-content">
                        Materials for: <span className="text-primary">{bookings.find(b => b.sessionId === selectedSessionId)?.sessionDetails?.title.slice(0, 20) || 'Session'}</span>
                    </h3>
                    {loadingMaterials ? (
                        <div className="text-base-content/70">Loading materials...</div>
                    ) : materials.length === 0 ? (
                        <div className="text-base-content/60">No materials found for this session.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                            {materials.map((mat) => (
                                <div key={mat._id} className="bg-base-200 rounded-md shadow-md p-4 flex flex-col items-center border border-base-300 w-full">
                                    <img
                                        src={mat.imageUrl}
                                        alt={mat.title}
                                        className="w-full h-40 object-cover rounded mb-3 border border-base-300 bg-base-100 max-w-xs sm:max-w-full"
                                    />
                                    <div className="flex flex-wrap gap-2 mb-2 w-full justify-center">
                                        <button
                                            className="btn btn-xs btn-outline btn-primary w-full sm:w-auto"
                                            onClick={() => handleDownload(mat.imageUrl, mat.title)}
                                        >
                                            <FaDownload /> Download Image
                                        </button>
                                        <a
                                            href={mat.resourceLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-xs btn-outline btn-success flex items-center gap-1 w-full sm:w-auto justify-center"
                                        >
                                            <FaExternalLinkAlt /> Google Drive
                                        </a>
                                    </div>
                                    <div className="text-center w-full">
                                        <div className="font-semibold text-base-content mb-1 break-words">
                                            {mat.title?.length > 15 ? mat.title.slice(0, 20) + '...' : mat.title}
                                        </div>
                                        <div className="text-xs text-base-content/70 break-words">Uploaded by: {mat.tutorEmail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudyMaterials;