import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import StudySessionCard from '../../components/card/StudySessionCard';

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

  const fetchSessions = async () => {
    const res = await axiosInstance('/available-sessions');
    return res.data;
  };

  const { data: sessions = [], isLoading, isError, error } = useQuery({
    queryKey: ['available-sessions'],
    queryFn: fetchSessions,
  });

  if (isLoading) return <div className="text-center py-8">Loading sessions...</div>;
  if (isError) return <div className="text-center py-8 text-error">Error: {error.message}</div>;
  if (!sessions.length) return <div className="text-center py-8">No available study sessions.</div>;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-8 text-center">Available Study Sessions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
    </section>
  );
};

export default StudySessions;