import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaCheckCircle, FaCalendarAlt, FaStickyNote, FaStar, FaChartBar } from 'react-icons/fa';
import { MdMenuBook } from 'react-icons/md';
import CountUp from 'react-countup';
import DashboardHeading from '../../../components/shared/DashboardHeading';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import StudentStatistic from '../../../components/charts/StudentStatistic';

const fetchStudentStats = async (axiosSecure, email) => {
  // 1. Fetch bookings
  const bookingsRes = await axiosSecure.get(`/bookedSessions/student/${email}`);
  const bookings = bookingsRes.data || [];
  const now = new Date();
  const completedSessions = bookings.filter(b => {
    if (!b.sessionDetails?.classEnd) return false;
    return new Date(b.sessionDetails.classEnd) < now;
  }).length;
  const upcomingSessions = bookings.filter(b => {
    if (!b.sessionDetails?.classStart) return false;
    return new Date(b.sessionDetails.classStart) > now;
  }).length;
  // 2. Fetch notes
  const notesRes = await axiosSecure.get(`/notes?email=${email}`);
  const notes = notesRes.data || [];
  // 3. Fetch reviews (for average rating)
  let allRatings = [];
  for (const booking of bookings) {
    if (!booking.sessionId) continue;
    try {
      const sessionReviewsRes = await axiosSecure.get(`/reviews/session/${booking.sessionId}`);
      const sessionReviews = sessionReviewsRes.data || [];
      // Only include reviews by this student
      const myReview = sessionReviews.find(r => r.studentEmail === email);
      if (myReview && myReview.rating) {
        allRatings.push(Number(myReview.rating));
      }
    } catch {
      // Ignore errors for individual session review fetches
    }
  }
  const averageRating = allRatings.length > 0 ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(2) : 0;
  return {
    totalBookings: bookings.length,
    completedSessions,
    upcomingSessions,
    notesCount: notes.length,
    averageRating
  };
};

const StudentDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: statsData = {
    totalBookings: 0,
    completedSessions: 0,
    upcomingSessions: 0,
    notesCount: 0,
    averageRating: 0
  }, isLoading } = useQuery({
    queryKey: ['studentStats', user?.email],
    queryFn: () => user?.email ? fetchStudentStats(axiosSecure, user.email) : Promise.resolve({
      totalBookings: 0,
      completedSessions: 0,
      upcomingSessions: 0,
      notesCount: 0,
      averageRating: 0
    }),
    enabled: !!user?.email
  });

  const stats = [
    {
      label: 'Total Bookings',
      value: statsData.totalBookings,
      icon: <MdMenuBook className="text-primary text-2xl" />,
      bg: 'bg-primary/10',
    },
    {
      label: 'Completed Sessions',
      value: statsData.completedSessions,
      icon: <FaCheckCircle className="text-success text-2xl" />,
      bg: 'bg-success/10',
    },
    {
      label: 'Upcoming Sessions',
      value: statsData.upcomingSessions,
      icon: <FaCalendarAlt className="text-info text-2xl" />,
      bg: 'bg-info/10',
    },
    {
      label: 'My Notes',
      value: statsData.notesCount,
      icon: <FaStickyNote className="text-warning text-2xl" />,
      bg: 'bg-warning/10',
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
      <title>Student Dashboard | Edu Sync</title>
      {/* Statistics Section */}
      <section className="max-w-5xl mx-auto mb-10">
        <DashboardHeading icon={FaChartBar} title='Student Dashboard Overview' />
        <h3 className="text-center text-xl font-semibold mb-6">Welcome Student, <span className='text-primary'>{user?.displayName} !</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      </section>

      <StudentStatistic stats={stats} />
    </div>
  );
};

export default StudentDashboard;