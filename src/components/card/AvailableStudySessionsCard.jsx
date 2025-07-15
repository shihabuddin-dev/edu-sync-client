import { useNavigate } from 'react-router';

const AvailableStudySessionsCard = ({ session }) => {
  const { title, sessionImage,description, registrationFee } = session || {}
  const navigate = useNavigate();

  // Ensure registrationFee is an object and calculate old price if not provided
  let currentPrice = registrationFee?.current ?? registrationFee;
  let oldPrice = registrationFee?.old ?? (currentPrice ? currentPrice * 2 : undefined);

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
          <div className="absolute inset-0 hover:bg-gradient-to-t from-primary/30 via-primary/10 to-transparent duration-400 ease-in-out transition-all" />
        </div>
      )}

      {/* Content Section */}
      <div className="card-body pb-3 p-0 flex flex-col gap-0 relative">
        {/* Unique Price Ribbon */}
        <div className="absolute -top-5 left-0 z-10">
          {(!currentPrice || currentPrice === 0) ? (
            <span className="bg-gradient-to-r from-primary to-primary/70 text-white px-3 py-1 rounded-br-lg shadow font-bold text-base">Free</span>
          ) : (
            <span className="bg-gradient-to-r from-primary to-primary/70 text-white px-4 py-1 rounded-br-lg shadow font-bold text-base flex items-center gap-2">
             ${currentPrice?.toLocaleString()}
              {oldPrice && (
                <span className="text-xs text-white/70 line-through ml-1">৳{oldPrice.toLocaleString()}</span>
              )}
              {oldPrice && (
                <span className="ml-2 bg-primary/80 text-white px-2 py-0.5 rounded text-xs font-semibold">-{Math.round(100 - (currentPrice / oldPrice) * 100)}%</span>
              )}
            </span>
          )}
        </div>
        {/* Title */}
        <h3 className="card-title text-lg font-bold line-clamp-1 group-hover:text-primary transition-colors mb-1 pt-7 px-5">
          {title.slice(0, 15)}{title.length > 15 ? '...' : ''}
        </h3>
        {/* Short Description */}
        <p className="text-sm text-base-content/70 mb-1 line-clamp-2 px-5">
          {description?.slice(0, 70)}{description && description.length > 70 ? '...' : ''}
        </p>
      
      </div>
    </div>
  );
};

export default AvailableStudySessionsCard;