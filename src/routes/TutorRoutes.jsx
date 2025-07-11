import { Navigate } from "react-router";
import Spinner from "../components/ui/Spinner";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const TutorRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();

    if (loading || roleLoading) {
        return <Spinner />;
    }
    if (!user || role !== 'tutor') {
        return <Navigate state={{ from: location?.pathname }} to="/forbidden" />;
    }
    return children;
};

export default TutorRoutes; 