import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import StudySessionCard from '../card/StudySessionCard';
import Spinner from '../ui/Spinner';

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

    if (isLoading) return <Spinner />
    if (isError) return <div className="text-center py-8">Error: {error.message}</div>;
    if (!sessions.length) return <div className="text-center py-8">No available study sessions.</div>;

    return (
        <section>
            <h2 className='mb-10 md:mb-12 text-center text-2xl md:text-3xl font-bold'>Available Study Sessions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {sessions?.map(session => (
                    // <AvailableStudySessionsCard
                    //     key={session._id}
                    //     session={session}
                    // />
                    <StudySessionCard key={session._id} session={session} />
                ))}
            </div>
        </section>
    );
};

export default AvailableStudySessions;