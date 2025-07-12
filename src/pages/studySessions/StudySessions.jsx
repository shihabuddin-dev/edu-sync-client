import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import StudySessionCard from '../../components/card/StudySessionCard';
import SectionTitle from '../../components/shared/SectionTitle';
import StatsSection from '../../components/extra/StatsSection';
import StudyPagination from '../../components/paginations/StudyPagination';
import { MdMenuBook } from 'react-icons/md';

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

const StudySessions = () => {
  const axiosInstance = useAxios();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of sessions per page

  const fetchSessions = async () => {
    const res = await axiosInstance(`/public-sessions?page=${currentPage}&limit=${itemsPerPage}`);
    return res.data;
  };

  const { data: sessionsData = { sessions: [], totalPages: 0, totalItems: 0 }, isLoading, isError, error } = useQuery({
    queryKey: ['public-sessions', currentPage],
    queryFn: fetchSessions,
  });

  const { sessions = [], totalPages = 0, totalItems = 0 } = sessionsData;

  if (isLoading) return <div className="text-center py-8">Loading sessions...</div>;
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

        {/* Sessions Grid Section */}
        <section className="bg-base-100 rounded-md shadow-md border border-base-300 p-4 sm:p-6 md:p-8 mb-8" data-aos="fade-up">
          <h2 className="text-xl md:text-2xl font-semibold text-base-content mb-6 text-center">Available Sessions</h2>
          {!sessions.length ? (
            <div className="text-center py-8 text-base-content/70">No available study sessions at the moment.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
                {sessions.map(session => {
                  const status = getStatus(session);
                  return (
                    <StudySessionCard
                      key={session._id}
                      session={session}
                      status={status}
                    />
                  );
                })}
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