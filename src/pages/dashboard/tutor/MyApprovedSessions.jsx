import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { MdVerified } from 'react-icons/md';
import Button from '../../../components/ui/Button';
import Spinner from '../../../components/ui/Spinner';

const MyApprovedSessions = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['approvedSessions', user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sessions?email=${user.email}`);
      return res.data.filter(session => session.status === 'approved');
    }
  });

  if (isLoading) return <Spinner />

  return (
    <div className="max-w-2xl mx-auto p-4">
      <DashboardHeading icon={MdVerified} title="My Approved Sessions" />
      <ul className="space-y-4 mt-6">
        {sessions.map(session => (
          <li key={session._id} className="bg-base-100 border border-primary/30 shadow rounded-md p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-transform duration-500 hover:scale-103 hover:shadow-md">
            <div>
              <div className="font-bold text-lg text-primary flex items-center gap-2">
                <MdVerified className="text-success text-xl" />
                {session.title}
              </div>
              <div className="text-xs text-base-content/60 mt-1">Session ID: <span className="font-mono">{session._id}</span></div>
            </div>
            <Button
              className="btn btn-sm mt-2 sm:mt-0 w-full sm:w-auto"
              onClick={() => navigate(`/dashboard/tutor/upload-materials/${session._id}`)}
            >
              Upload Material
            </Button>
          </li>
        ))}
        {sessions.length === 0 && <div className="text-center text-base-content/60 py-8">No approved sessions found.</div>}
      </ul>
    </div>
  );
};

export default MyApprovedSessions;