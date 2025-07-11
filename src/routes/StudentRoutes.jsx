import { Navigate, useLocation } from "react-router";
import Spinner from "../components/ui/Spinner";
import useUserRole from "../hooks/useUserRole";

const StudentRoutes = ({ children }) => {
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (roleLoading) {
    return <Spinner />;
  }

  if (role !== 'student' && role !== 'tutor' && role !== 'admin') {
    return <Navigate state={location?.pathname} to="/dashboard" />;
  }

  return children;
};

export default StudentRoutes; 