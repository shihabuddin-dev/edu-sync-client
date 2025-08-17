import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import StudySessionCard from '../../components/card/StudySessionCard';
import SectionTitle from '../../components/shared/SectionTitle';
import StatsSection from '../../components/extra/StatsSection';
import StudyPagination from '../../components/paginations/StudyPagination';
import { MdMenuBook } from 'react-icons/md';
import Spinner from '../../components/ui/Spinner';



const StudySessions = () => {
  const axiosInstance = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of sessions per page
  const [sortType, setSortType] = useState('reviews-desc'); // 'reviews-desc', 'reviews-asc'
  const [durationFilter, setDurationFilter] = useState('all'); // 'all', 'lt1', '1to2', 'gt2'
  const axiosSecure = useAxiosSecure();
  const [reviewCounts, setReviewCounts] = useState({});

  const fetchSessions = async () => {
    const res = await axiosInstance(`/public-sessions?page=${currentPage}&limit=${itemsPerPage}`);
    return res.data;
  };

  const { data: sessionsData = { sessions: [], totalPages: 0, totalItems: 0 }, isLoading, isError, error } = useQuery({
    queryKey: ['public-sessions', currentPage],
    queryFn: fetchSessions,
  });

  const { sessions = [], totalPages = 0, totalItems = 0 } = sessionsData;


  // Fetch review counts for all sessions on page
  useEffect(() => {
    if (!sessions.length) return;
    let isMounted = true;
    const fetchCounts = async () => {
      const counts = {};
      await Promise.all(sessions.map(async (session) => {
        try {
          const res = await axiosSecure.get(`/reviews/session/${session._id}`);
          counts[session._id] = Array.isArray(res.data) ? res.data.length : 0;
        } catch {
          counts[session._id] = 0;
        }
      }));
      if (isMounted) setReviewCounts(counts);
    };
    fetchCounts();
    return () => { isMounted = false; };
  }, [sessions, axiosSecure]);

  // Filter sessions by duration using durationValue and durationUnit
  const filteredSessions = sessions.filter(session => {
    let minutes = 0;
    const value = Number(session.durationValue);
    const unit = (session.durationUnit || '').toLowerCase();
    if (!isNaN(value)) {
      if (unit === 'days') minutes = value * 24 * 60;
      else if (unit === 'hours') minutes = value * 60;
      else if (unit === 'minutes') minutes = value;
    }
    if (durationFilter === 'all') return true;
    if (!minutes) return false;
    if (durationFilter === 'lt1') return minutes < 60;
    if (durationFilter === '1to2') return minutes >= 60 && minutes <= 120;
    if (durationFilter === 'gt2') return minutes > 120;
    return true;
  });

  // Sort filtered sessions by review count only
  const sortedSessions = [...filteredSessions].sort((a, b) => {
    const aReviews = reviewCounts[a._id] || 0;
    const bReviews = reviewCounts[b._id] || 0;
    if (sortType === 'reviews-asc') return aReviews - bReviews;
    return bReviews - aReviews; // default to desc
  });

  if (isLoading) return <Spinner />
  if (isError) return <div className="text-center py-8 text-error">Error: {error.message}</div>;

  // Prepare stats data for the component
  const sessionStats = [
    {
      icon: <MdMenuBook className="text-primary" />,
      value: totalItems,
      label: 'Total Sessions',
      bgColor: 'bg-primary/10',
      textColor: 'text-primary'
    },
    {
      icon: <MdMenuBook className="text-success" />,
      value: sessions.filter(s => s.status === 'approved').length,
      label: 'Approved Sessions',
      bgColor: 'bg-success/10',
      textColor: 'text-success'
    },
    {
      icon: <MdMenuBook className="text-warning" />,
      value: sessions.filter(s => s.status === 'pending').length,
      label: 'Pending Sessions',
      bgColor: 'bg-warning/10',
      textColor: 'text-warning'
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <title>Study Sessions | Edu Sync</title>
      {/* Header Section */}
      <div className="bg-base-100 shadow-md pb-2" data-aos="fade-up-right">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <SectionTitle title="All Study Sessions" icon={<MdMenuBook />} />
          <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Browse and join a variety of study sessions led by expert tutors and passionate learners. Find the perfect session for your needs and start learning together!
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-12">
        {/* Stats Section */}
        <StatsSection
          title="Session Statistics"
          stats={sessionStats}
          className="mb-8"
        />

        {/* Filter and Sorting Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          {/* Duration Filter */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-base-content/80">Filter by duration:</label>
            <select
              className="select select-bordered select-sm w-40 focus:outline-0"
              value={durationFilter}
              onChange={e => setDurationFilter(e.target.value)}
            >
              <option value="all">All Durations</option>
              <option value="lt1">Less than 1 hour</option>
              <option value="1to2">1-2 hours</option>
              <option value="gt2">More than 2 hours</option>
            </select>
          </div>
          {/* Sorting Dropdown (Reviews only) */}
          <div className="flex items-center gap-2">
            <label className="font-medium text-base-content/80">Sort by reviews:</label>
            <select
              className="select select-bordered select-sm w-44 focus:outline-0"
              value={sortType}
              onChange={e => setSortType(e.target.value)}
            >
              <option value="reviews-desc">Most Reviews</option>
              <option value="reviews-asc">Fewest Reviews</option>
            </select>
          </div>
        </div>

        {/* Sessions Grid Section */}
        <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8" data-aos="fade-up">
          <h2 className='mb-2 md:mb-2 text-center text-xl md:text-2xl font-semibold text-base-content'>Available Study Sessions</h2>
          <p className="text-center text-base-content/80 mb-8 md:mb-10 text-sm max-w-2xl mx-auto">Browse and join a variety of upcoming study sessions tailored to your interests and schedule.</p>
          {sortedSessions.length === 0 ? (
            <div className="text-center py-8 text-base-content/70">
              No study sessions match your filter.
              {(durationFilter !== 'all' || sortType !== 'reviews-desc') && (
                <div className="mt-4">
                  <button
                    onClick={() => {
                      setDurationFilter('all');
                      setSortType('reviews-desc');
                    }}
                    className="btn btn-primary btn-sm"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
                {sortedSessions.map(session => (
                  <StudySessionCard
                    key={session._id}
                    session={session}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-base-300 pt-6">
                <StudyPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudySessions;