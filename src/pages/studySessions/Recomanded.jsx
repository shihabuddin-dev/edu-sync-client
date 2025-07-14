import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';
import useAxios from '../../hooks/useAxios';
import StudySessionCard from '../../components/card/StudySessionCard';

const Recomanded = () => {
    const { id } = useParams();
    const axiosInstance = useAxios();

    // Fetch available sessions (approved only, limited, sorted)
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['available-sessions'],
        queryFn: async () => {
            const res = await axiosInstance('/available-sessions');
            return res.data || [];
        },
    });

    // Filter out the current session and pick up to 3 others
    const recommended = Array.isArray(sessions)
        ? sessions.filter((s) => s._id !== id).slice(0, 3)
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

export default Recomanded;