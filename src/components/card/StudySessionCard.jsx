import React from 'react';
import { Link } from 'react-router';
import { FaUser, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle } from 'react-icons/fa';
import Button from '../ui/Button';

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

const StudySessionCard = ({ session, status }) => {
    const { _id, title, description, sessionImage, registrationEnd } = session || {};
    return (
        <div className="card bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-primary/50 hover:shadow-md hover:border-primary/40 group cursor-pointer">
            {/* Image section */}
            {sessionImage && (
                <div className="relative h-40 w-full overflow-hidden">
                    <img
                        src={sessionImage}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Registration end badge (top left) */}
                    {registrationEnd && (
                        <span className="absolute top-3 left-3 badge badge-outline rounded border-primary badge-sm text-xs text-base-content/60 bg-base-100/80 backdrop-blur-sm">
                            Ends: {formatDate(registrationEnd)}
                        </span>
                    )}
                    {/* Status badge (top right) */}
                    <span className={`absolute top-3 right-3 badge badge-sm rounded-md border-2 shadow-md backdrop-blur-sm ${statusColors[status]?.bg} ${statusColors[status]?.text} ${statusColors[status]?.border} hover:shadow-primary/50 hover:shadow-md transition-all duration-200`}>
                        <span className={`animate-pulse w-2 h-2 rounded-full ${statusColors[status]?.dot}`}></span>
                        {status}
                    </span>
                </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-200">{title?.slice(0, 16)}{title && title.length > 30 ? '...' : ''}</h3>
                <p className="text-base-content/70 text-sm mb-3">{description?.slice(0, 60)}{description && description.length > 60 ? '...' : ''}</p>
                <div className="flex items-center gap-4 mb-2 mt-auto" >
                    {session.status === 'approved' && (
                        <span className="flex items-center gap-1 text-success font-semibold">
                            <FaCheckCircle className="inline" /> Approved
                        </span>
                    )}
                    {session.status === 'pending' && (
                        <span className="flex items-center gap-1 text-warning font-semibold">
                            <FaHourglassHalf className="inline" /> Pending
                        </span>
                    )}
                    {session.status === 'rejected' && (
                        <span className="flex items-center gap-1 text-error font-semibold">
                            <FaTimesCircle className="inline" /> Rejected
                        </span>
                    )}
                </div>
                <div >
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