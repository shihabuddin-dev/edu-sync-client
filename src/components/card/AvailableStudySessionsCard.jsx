import { useNavigate } from 'react-router';
import { FaUser } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';

const statusStyles = {
  Ongoing: { bg: 'bg-green-500/90', border: 'border-green-500', text: 'text-white', dot: 'bg-white' },
  Closed: { bg: 'bg-red-500/90', text: 'text-white', border: 'border-red-500', dot: 'bg-white' },
  Upcoming: { bg: 'bg-red-500/90', text: 'text-white', border: 'border-red-500', dot: 'bg-white' },
};

const AvailableStudySessionsCard = ({ session, status }) => {
  const { title, sessionImage, tutorName, duration } = session || {}
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/study-sessions/${session._id}`)}
      title='Click to see details'
      className="card bg-base-100 rounded-md shadow-md border border-base-300 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 group cursor-pointer"
    >
      {/* Image Section with Floating Status */}
      {sessionImage && (
        <div className="relative h-38 overflow-hidden">
          <img
            src={sessionImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-300/40 via-base-300/10 to-transparent" />

          {/* Floating status badge */}
          <div className="absolute top-4 right-4 flex items-center">
            <span className={`badge badge-sm rounded border-2 shadow-md backdrop-blur-sm ${statusStyles[status]?.bg} ${statusStyles[status]?.text} ${statusStyles[status]?.border} hover:scale-105 transition-transform duration-200`}>
              <span className={`animate-pulse w-2 h-2 rounded-full ${statusStyles[status]?.dot}`}></span>
              {status}
            </span>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="card-body p-5">
        {/* Title */}
        <h3 className="card-title text-xl line-clamp-2 group-hover:text-primary transition-colors">
          {title.slice(0, 20)}
        </h3>

        {/* Divider */}
        <div className="divider my-2"></div>

        {/* Session Details */}
        <div className="grid grid-cols-2 gap-3">
          {/* Tutor */}
          {tutorName && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded bg-primary/10 text-primary">
                <FaUser className="text-sm" />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Tutor</p>
                <p className="font-medium text-base-content truncate">{tutorName}</p>
              </div>
            </div>
          )}

          {/* Duration */}
          {duration && (
            <div className="flex items-center gap-2 text-sm">
              <div className="p-2 rounded bg-primary/10 text-primary">
                <IoMdTime className="text-sm" />
              </div>
              <div>
                <p className="text-xs text-base-content/60">Duration</p>
                <p className="font-medium text-base-content">{duration}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailableStudySessionsCard;