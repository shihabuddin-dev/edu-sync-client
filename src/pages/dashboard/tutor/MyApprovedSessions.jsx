import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import { MdVerified } from 'react-icons/md';
import Button from '../../../components/ui/Button';

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

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <DashboardHeading icon={MdVerified} title='My Approved Sessions' />
      <ul>
        {sessions.map(session => (
          <li key={session._id} className="mb-4 p-4 border border-primary rounded-md">
            <div className="font-semibold">{session.title}</div>
            <div className="text-xs text-gray-500">Session ID: {session._id}</div>
            <Button
              className="btn btn-sm mt-2"
              onClick={() => navigate(`/dashboard/tutor/upload-materials/${session._id}`)}
            >
              Upload Material
            </Button>
          </li>
        ))}
        {sessions.length === 0 && <div>No approved sessions found.</div>}
      </ul>
    </div>
  );
};

export default MyApprovedSessions; 