import React from 'react';
import { Link } from 'react-router';

const statusColors = {
    Ongoing: 'badge-success',
    Closed: 'badge-error',
};

const StudySessionCard = ({ session, status }) => {
    const { _id, title, description } = session || {}
    return (
        <div className="card bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden flex flex-col">
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{title}</h3>
                <p className="text-base-content/70 text-sm mb-4 line-clamp-3">{description}</p>
                <div className="flex items-center gap-2 mb-4">
                    <span className={`badge ${statusColors[status] || 'badge-ghost'} text-white font-semibold px-3 py-1`}>
                        {status}
                    </span>
                </div>
                <div className="mt-auto">
                    <Link to={`/study-sessions/${_id}`}> <button className="btn btn-primary btn-sm w-full" >
                        Read More
                    </button></Link>

                </div>
            </div>
        </div>
    );
};

export default StudySessionCard;