import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import StudySessionCard from '../../components/card/StudySessionCard';

const Recommended = ({ sessionId }) => {
    const axiosInstance = useAxios();

    // Fetch available sessions (approved only, limited, sorted)
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['available-sessions'],
        queryFn: async () => {
            const res = await axiosInstance('/available-sessions');
            return res.data || [];
        },
    });

    const recommended = Array.isArray(sessions)
        ? sessions
            .filter((s) => String(s._id) !== String(sessionId))
            .slice(0, 3)
        : [];

    if (isLoading) {
        return <div className="text-center py-8 text-base-content/60">Loading recommended sessions...</div>;
    }

    if (!recommended.length) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-bold mb-6 text-primary">Recommended Sessions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                {recommended.map((session) => (
                    <StudySessionCard
                        key={session._id}
                        session={session}
                    />
                ))}
            </div>
        </div>
    );
};

export default Recommended;