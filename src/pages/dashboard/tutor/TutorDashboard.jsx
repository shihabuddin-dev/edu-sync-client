import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import CountUp from 'react-countup';
import TutorStatistic from '../../../components/charts/TutorStatistic';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaUserGraduate, FaStar, FaChalkboardTeacher, FaChartBar } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';

const fetchTutorStats = async (axiosSecure, email) => {
    // 1. Fetch all sessions for this tutor
    const sessionsRes = await axiosSecure.get(`/sessions?email=${email}`);
    const sessions = sessionsRes.data || [];
    const totalSessions = sessions.length;
    const approvedSessions = sessions.filter(s => s.status === 'approved').length;
    const pendingSessions = sessions.filter(s => s.status === 'pending').length;
    const rejectedSessions = sessions.filter(s => s.status === 'rejected').length;

    // 2. Fetch all bookings for these sessions (to get unique students)
    let allBookings = [];
    for (const session of sessions) {
        try {
            // You may need to implement this endpoint in your backend:
            // /bookedSessions/session/:sessionId
            const bookingsRes = await axiosSecure.get(`/bookedSessions/session/${session._id}`);
            allBookings = allBookings.concat(bookingsRes.data || []);
        } catch {
            // nothing
        }
    }
    const uniqueStudents = new Set(allBookings.map(b => b.studentEmail)).size;

    // 3. Fetch all reviews for these sessions to calculate average rating
    let allRatings = [];
    for (const session of sessions) {
        try {
            const reviewsRes = await axiosSecure.get(`/reviews/session/${session._id}`);
            const reviews = reviewsRes.data || [];
            reviews.forEach(r => {
                if (r.rating) allRatings.push(Number(r.rating));
            });
        } catch { 
            // nothing
        }
    }
    const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : 0;

    return {
        totalSessions,
        approvedSessions,
        pendingSessions,
        rejectedSessions,
        uniqueStudents,
        averageRating
    };
};

const TutorDashboard = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: statsData = {
        totalSessions: 0,
        approvedSessions: 0,
        pendingSessions: 0,
        rejectedSessions: 0,
        uniqueStudents: 0,
        averageRating: 0
    }, isLoading } = useQuery({
        queryKey: ['tutorStats', user?.email],
        queryFn: () => user?.email ? fetchTutorStats(axiosSecure, user.email) : Promise.resolve({
            totalSessions: 0,
            approvedSessions: 0,
            pendingSessions: 0,
            rejectedSessions: 0,
            uniqueStudents: 0,
            averageRating: 0
        }),
        enabled: !!user?.email
    });

    const stats = [
        {
            label: 'Total Sessions',
            value: statsData.totalSessions,
            icon: <FaChalkboardTeacher className="text-primary text-2xl" />,
            bg: 'bg-primary/10',
        },
        {
            label: 'Approved Sessions',
            value: statsData.approvedSessions,
            icon: <FaCheckCircle className="text-success text-2xl" />,
            bg: 'bg-success/10',
        },
        {
            label: 'Pending Sessions',
            value: statsData.pendingSessions,
            icon: <FaHourglassHalf className="text-warning text-2xl" />,
            bg: 'bg-warning/10',
        },
        {
            label: 'Rejected Sessions',
            value: statsData.rejectedSessions,
            icon: <FaTimesCircle className="text-error text-2xl" />,
            bg: 'bg-error/10',
        },
        {
            label: 'Unique Students',
            value: statsData.uniqueStudents,
            icon: <FaUserGraduate className="text-info text-2xl" />,
            bg: 'bg-info/10',
        },
        {
            label: 'Average Rating',
            value: statsData.averageRating,
            icon: <FaStar className="text-yellow-500 text-2xl" />,
            bg: 'bg-primary/10',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 md:p-8">
            <section className="max-w-5xl mx-auto mb-10">
                <DashboardHeading icon={FaChartBar} title='Welcome to Your Dashboard' />
                <h3 className="text-center text-xl font-semibold mb-6">Hello Tutor, <span className='text-primary'>{user?.displayName} !</span></h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                    {isLoading ? (
                        <div className="col-span-5 text-center py-10">Loading statistics...</div>
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
                <TutorStatistic stats={stats} />
            </section>
        </div>
    );
};

export default TutorDashboard;