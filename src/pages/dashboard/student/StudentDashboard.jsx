import React from 'react';
import { FaBookOpen, FaCheckCircle, FaCalendarAlt, FaStickyNote, FaStar, FaChartBar } from 'react-icons/fa';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import useAuth from '../../../hooks/useAuth';

const stats = [
    {
        label: 'Total Bookings',
        value: 12,
        icon: <FaBookOpen className="text-primary text-2xl" />,
        bg: 'bg-primary/10',
    },
    {
        label: 'Completed Sessions',
        value: 8,
        icon: <FaCheckCircle className="text-success text-2xl" />,
        bg: 'bg-success/10',
    },
    {
        label: 'Upcoming Sessions',
        value: 2,
        icon: <FaCalendarAlt className="text-info text-2xl" />,
        bg: 'bg-info/10',
    },
    {
        label: 'My Notes',
        value: 5,
        icon: <FaStickyNote className="text-warning text-2xl" />,
        bg: 'bg-warning/10',
    },
    {
        label: 'Average Rating',
        value: 4.7,
        icon: <FaStar className="text-yellow-500 text-2xl" />,
        bg: 'bg-primary/10',
    },
];

const StudentDashboard = () => {
    const { user } = useAuth()
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 p-4 md:p-8">
            {/* Statistics Section */}
            <section className="max-w-5xl mx-auto mb-10">
                <DashboardHeading icon={FaChartBar} title='My Study Statistics' />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`flex flex-col items-center justify-center rounded-md shadow-sm p-6 ${stat.bg} hover:shadow-md transition group`}
                        >
                            <div className="mb-2">{stat.icon}</div>
                            <div className="text-3xl font-extrabold text-base-content group-hover:text-primary transition">{stat.value}</div>
                            <div className="text-base-content/70 text-sm mt-1 text-center font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Unique Welcome Section */}
            <section className="max-w-3xl mx-auto bg-base-100 rounded-md shadow-md p-8 flex flex-col items-center gap-4 border border-primary/10" data-aos="fade-up">
                <h3 className="text-xl md:text-2xl font-semibold  mb-2">Welcome Back, <span className='text-primary'>{user?.displayName} !</span></h3>
                <p className="text-base-content/80 text-center max-w-xl">
                    Here you can track your study progress, manage your notes, and see all your upcoming and completed sessions. Keep learning, stay organized, and reach your goals with Edu Sync!
                </p>
            </section>
        </div>
    );
};

export default StudentDashboard;