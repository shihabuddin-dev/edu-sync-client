import React from 'react';
import { Link } from 'react-router';
import { FaStar, FaBook } from 'react-icons/fa';
import Button from '../ui/Button';

import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const getStatus = (session) => {
    const now = new Date();
    const regStart = new Date(session.registrationStart);
    const regEnd = new Date(session.registrationEnd);
    if (now >= regStart && now <= regEnd) {
        return 'Ongoing';
    } else {
        return 'Closed';
    }
};

const statusColors = {
    Ongoing: { bg: 'bg-green-500/90', border: 'border-green-500', text: 'text-white', dot: 'bg-white' },
    Closed: { bg: 'bg-red-500/90', text: 'text-white', border: 'border-red-500', dot: 'bg-white' },
    Upcoming: { bg: 'bg-red-500/90', text: 'text-white', border: 'border-red-500', dot: 'bg-white' },
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const StudySessionCard = ({ session }) => {
    const { _id, title, description, sessionImage, registrationEnd } = session || {};
    const status = getStatus(session);
    const axiosSecure = useAxiosSecure();

    // Fetch reviews for this session
    const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
        queryKey: ['session-reviews', _id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/reviews/session/${_id}`);
            return res.data;
        },
        enabled: !!_id,
    });

    // Calculate average rating and review count
    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : 0;
    const reviewCount = reviews.length;

    return (
        <div className="relative card bg-gradient-to-br from-primary/10 via-base-100 to-base-200 rounded-md shadow-md border border-primary/20 overflow-hidden flex flex-col transition-transform duration-400 hover:-translate-y-2 hover:shadow-primary/40 hover:border-primary/60 group cursor-pointer">
            {/* Background watermark icon */}
            <FaBook className="absolute right-4 bottom-4 text-primary/5 text-8xl pointer-events-none z-0 group-hover:text-primary/10 transition-all duration-300" />
            {/* Image section */}
            {sessionImage && (
                <div className="relative h-40 w-full overflow-hidden z-10">
                    <img
                        src={sessionImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-md"
                    />
                    {/* Registration end badge (top left) */}
                    {status === 'Ongoing' && registrationEnd && (
                        <span className="absolute top-3 left-3 badge badge-outline rounded border-primary badge-sm text-xs text-base-content/60 bg-base-100/80 backdrop-blur-sm">
                            Ends: {formatDate(registrationEnd)}
                        </span>
                    )}
                    {/* Status badge (top right) */}
                    <span className={`absolute top-3 right-3 badge badge-sm rounded border-2 shadow-md backdrop-blur-sm ${statusColors[status]?.bg} ${statusColors[status]?.text} ${statusColors[status]?.border} hover:shadow-primary/50 hover:shadow-md transition-all duration-200`}>
                        <span className={`animate-pulse w-2 h-2 rounded-full ${statusColors[status]?.dot}`}></span>
                        {status}
                    </span>
                </div>
            )}
            <div className="p-5 flex-1 flex flex-col space-y-2 z-10">
                <h3 className="text-xl font-bold group-hover:text-primary transition-colors duration-200 drop-shadow-sm">{title?.slice(0, 16)}{title && title.length > 30 ? '...' : ''}</h3>
                <p className="text-base-content/70 text-sm drop-shadow-xs">{description?.slice(0, 40)}{description && description.length > 40 ? '...' : ''}</p>
                {/* Ratings and reviews */}
                <div className="flex items-center gap-2 mt-1">
                    <FaStar className="text-warning text-base" />
                    {reviewsLoading ? (
                        <>
                            <span className="font-semibold text-base-content">...</span>
                            <span className="text-xs text-base-content/60">(loading...)</span>
                        </>
                    ) : (
                        <>
                            <span className="font-semibold text-base-content">{averageRating}</span>
                            <span className="text-xs text-base-content/60">({reviewCount} review{reviewCount !== 1 ? 's' : ''})</span>
                        </>
                    )}
                </div>
                <div>
                    <Link to={`/study-sessions/${_id}`}>
                        <Button className='btn btn-sm w-full'>
                            Read More
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default StudySessionCard;