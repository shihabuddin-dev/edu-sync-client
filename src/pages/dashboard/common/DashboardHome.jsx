
import Spinner from "../../../components/ui/Spinner";
import useUserRole from "../../../hooks/useUserRole";
import Forbidden from "../../forbidden/Forbidden";
import AdminDashboard from "../admin/AdminDashboard";
import StudentDashboard from "../student/StudentDashboard";
import TutorDashboard from "../tutor/TutorDashboard";


const DashboardHome = () => {
    const { role, roleLoading } = useUserRole();

    if (roleLoading) {
        return <Spinner />;
    }
    if (role === 'student') {
        return <StudentDashboard />;
    } else if (role === 'tutor') {
        return <TutorDashboard />;
    } else if (role === 'admin') {
        return <AdminDashboard />;
    } else {
        return <Forbidden />;
    }
};

export default DashboardHome;