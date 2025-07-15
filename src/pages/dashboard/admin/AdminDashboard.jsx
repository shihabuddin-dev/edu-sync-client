import React from 'react';
import AdminStatistic from '../../../components/charts/AdminStatistic';
import { useQuery } from '@tanstack/react-query';
import CountUp from 'react-countup';
import { FaUsers, FaBookOpen, FaChalkboardTeacher, FaUserGraduate, FaStar, FaChartBar } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

// Fetch admin stats from backend
const fetchAdminStats = async (axiosSecure) => {
    const res = await axiosSecure.get('/admin/statistics');
    return res.data;
};

const AdminDashboard = () => {
    const {user}=useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: statsData = {
        totalUsers: 0,
        totalSessions: 0,
        totalTutors: 0,
        totalStudents: 0,
        totalBookings: 0,
        averageRating: 0
    }, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => fetchAdminStats(axiosSecure)
    });

    const stats = [
        {
            label: 'Total Users',
            value: statsData.totalUsers,
            icon: <FaUsers className="text-primary text-2xl" />,
            bg: 'bg-primary/10',
        },
        {
            label: 'Total Sessions',
            value: statsData.totalSessions,
            icon: <FaBookOpen className="text-info text-2xl" />,
            bg: 'bg-info/10',
        },
        {
            label: 'Total Tutors',
            value: statsData.totalTutors,
            icon: <FaChalkboardTeacher className="text-success text-2xl" />,
            bg: 'bg-success/10',
        },
        {
            label: 'Total Students',
            value: statsData.totalStudents,
            icon: <FaUserGraduate className="text-warning text-2xl" />,
            bg: 'bg-error/10',
        },
        {
            label: 'Total Bookings',
            value: statsData.totalBookings,
            icon: <FaBookOpen className="text-error text-2xl" />,
            bg: 'bg-warning/10',
        },
        {
            label: 'Average Rating',
            value: statsData.averageRating,
            icon: <FaStar className="text-yellow-500 text-2xl" />,
            bg: 'bg-primary/8',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 md:p-8">
             <title>Admin Dashboard | Edu Sync</title>
            <section className="max-w-5xl mx-auto mb-10">
                <DashboardHeading icon={FaChartBar} title='Admin Dashboard Overview' />
                <h3 className="text-center text-xl font-semibold mb-6">Hello, <span className='text-primary'>{user?.displayName} !</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {isLoading ? (
                        <div className="col-span-6 text-center py-10">Loading statistics...</div>
                    ) : (
                        stats.map((stat) => (
                            <div
                                key={stat.label}
                                className={`flex flex-col items-center justify-center rounded-md shadow-sm p-6 ${stat.bg} hover:shadow-md transition group`}
                            >
                                <div className="mb-2">{stat.icon}</div>
                                <div className="text-3xl font-extrabold text-base-content group-hover:text-primary transition">
                                    <CountUp end={Number(stat.value)} duration={5} separator="," />+
                                </div>
                                <div className="text-base-content/70 text-sm mt-1 text-center font-medium">{stat.label}</div>
                            </div>
                        ))
                    )}
                </div>
                <AdminStatistic stats={stats} />
            </section>
        </div>
    );
};

export default AdminDashboard;