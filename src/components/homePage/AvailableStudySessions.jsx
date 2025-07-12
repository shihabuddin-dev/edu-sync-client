import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import AvailableStudySessionsCard from '../card/AvailableStudySessionsCard';
import DashboardHeading from '../shared/DashboardHeading';

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

const AvailableStudySessions = () => {
  const axiosInstance = useAxios();

  const fetchSessions = async () => {
    const res = await axiosInstance('/available-sessions');
    return res.data;
  };

  const { data: sessions = [], isLoading, isError, error } = useQuery({
    queryKey: ['sessions', 8],
    queryFn: fetchSessions,
  });

  if (isLoading) return <div className="text-center py-8">Loading sessions...</div>;
  if (isError) return <div className="text-center py-8">Error: {error.message}</div>;
  if (!sessions.length) return <div className="text-center py-8">No available study sessions.</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <DashboardHeading title='Available Study Sessions'/>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {sessions?.map(session => (
          <AvailableStudySessionsCard
            key={session._id}
            session={session}
            status={getStatus(session)}
          />
        ))}
      </div>
    </section>
  );
};

export default AvailableStudySessions;