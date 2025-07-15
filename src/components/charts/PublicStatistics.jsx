import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, LabelList } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';
import { FaExclamationTriangle } from 'react-icons/fa';

// Unique, visually appealing color palette
const CHART_COLORS = [
  '#6366F1', // Indigo
  '#F59E42', // Orange
  '#10B981', // Emerald
  '#F43F5E', // Rose
  '#A21CAF', // Purple
  '#FBBF24', // Amber
  '#0EA5E9', // Sky
  '#E11D48', // Red
  '#84CC16', // Lime
  '#F472B6', // Pink
  '#14B8A6', // Teal
  '#FACC15', // Yellow
];

const PIE_COLORS = CHART_COLORS;

const CustomPieLegend = ({ payload }) => (
  <ul className="flex flex-wrap gap-4 justify-center mt-4">
    {payload.map((entry, idx) => (
      <li key={entry.value} className="flex items-center gap-2 text-base-content/80 text-sm md:text-base">
        <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
        {entry.value}
      </li>
    ))}
  </ul>
);

const Spinner = () => (
  <div className="flex justify-center items-center py-8">
    <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-label="Loading">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
    </svg>
  </div>
);

const ErrorMsg = ({ message }) => (
  <div className="flex flex-col items-center py-8 text-red-500 font-semibold">
    <FaExclamationTriangle className="mb-2 text-2xl" aria-hidden="true" />
    <span>{message}</span>
  </div>
);

const PublicStatistics = ({ compact = false }) => {
  const axiosInstance = useAxios();
  // Sessions for BarChart
  const { data: sessionData, isLoading: sessionsLoading, isError: sessionsError, error: sessionsErrorObj } = useQuery({
    queryKey: ['public-sessions', 1],
    queryFn: async () => {
      const res = await axiosInstance('/public-sessions?page=1&limit=12');
      return res.data;
    },
  });
  // Announcements for PieChart
  const { data: announcements, isLoading: announcementsLoading, isError: announcementsError, error: announcementsErrorObj } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await axiosInstance('/announcements');
      return res.data;
    },
  });
  // Tutors for PieChart
  const { data: tutors, isLoading: tutorsLoading, isError: tutorsError, error: tutorsErrorObj } = useQuery({
    queryKey: ['tutors'],
    queryFn: async () => {
      const res = await axiosInstance('/tutors');
      return res.data;
    },
  });

  // Prepare BarChart data
  let chartData = [];
  if (sessionData && sessionData.sessions) {
    chartData = sessionData.sessions.map((session, idx) => ({
      name: session.title?.slice(0, 12) || `Session ${idx + 1}`,
      Fee: session.registrationFee || 0,
      Duration: session.duration || 0,
    }));
  }

  // Prepare PieChart data (announcements by category)
  let pieData = [];
  let totalAnnouncements = 0;
  if (announcements && Array.isArray(announcements)) {
    const categoryCount = {};
    announcements.forEach(a => {
      const cat = a.category || 'Uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    pieData = Object.entries(categoryCount).map(([cat, count]) => ({ name: cat, value: count }));
    totalAnnouncements = announcements.length;
  }

  // Tutors PieChart data: count by specialty
  let tutorsPieData = [];
  if (Array.isArray(tutors)) {
    const specialtyCount = {};
    tutors.forEach(t => {
      const key = t.specialty || 'Unknown';
      specialtyCount[key] = (specialtyCount[key] || 0) + 1;
    });
    tutorsPieData = Object.entries(specialtyCount).map(([name, value]) => ({ name, value }));
  }

  return (
    <div
      className={
        compact
          ? "space-y-8"
          : "grid grid-cols-1 lg:grid-cols-1 gap-8 lg:gap-10 items-stretch justify-center w-full max-w-5xl mx-auto"
      }
    >
      {/* Bar Chart Section */}
      <section
        className={
          compact
            ? "w-full bg-base-100 rounded-md shadow-lg p-4 md:p-6 border border-primary/10"
            : "w-full bg-base-100 rounded-md shadow-lg p-6 md:p-8 border border-primary/10"
        }
        aria-label="Study Sessions Statistics"
      >
        <h3 className="text-lg md:text-xl font-bold mb-2 text-primary">Study Sessions Overview</h3>
        <p className="text-base-content/70 mb-4">Compare registration fees and durations for recent public study sessions.</p>
        {sessionsLoading ? (
          <Spinner />
        ) : sessionsError ? (
          <ErrorMsg message={sessionsErrorObj?.message || 'Failed to load data'} />
        ) : (
          <ResponsiveContainer width="100%" height={compact ? 220 : 300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barGap={8} role="img" aria-label="Bar chart of study sessions">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" label={{ value: 'Session', position: 'insideBottom', offset: -5, fontSize: 13, fill: '#6366F1' }} tick={{ fontSize: 12 }} />
              <YAxis label={{ value: 'Value', angle: -90, position: 'insideLeft', fontSize: 13, fill: '#6366F1' }} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar dataKey="Fee" radius={[8, 8, 0, 0]} name="Registration Fee" className="hover:opacity-80">
                {chartData.map((entry, idx) => (
                  <Cell key={`fee-bar-${idx}`} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                ))}
                <LabelList dataKey="Fee" position="top" formatter={v => v > 0 ? v : ''} style={{ fontWeight: 600, fontSize: 12 }} />
              </Bar>
              <Bar dataKey="Duration" radius={[8, 8, 0, 0]} name="Duration (min)" className="hover:opacity-80">
                {chartData.map((entry, idx) => (
                  <Cell key={`duration-bar-${idx}`} fill={CHART_COLORS[(idx + 1) % CHART_COLORS.length]} />
                ))}
                <LabelList dataKey="Duration" position="top" formatter={v => v > 0 ? v : ''} style={{ fontWeight: 600, fontSize: 12 }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
      {/* Pie Chart Section */}
      <section
        className={
          compact
            ? "w-full bg-base-100 rounded-md shadow-lg p-4 md:p-6 border border-primary/10"
            : "w-full bg-base-100 rounded-md shadow-lg p-6 md:p-8 border border-primary/10"
        }
        aria-label="Announcements Statistics"
      >
        <h3 className="text-lg md:text-xl font-bold mb-2 text-primary">Announcements by Category</h3>
        <p className="text-base-content/70 mb-4">Distribution of all <span className="font-semibold text-blue-600">{totalAnnouncements}</span> announcements by their category.</p>
        {announcementsLoading ? (
          <Spinner />
        ) : announcementsError ? (
          <ErrorMsg message={announcementsErrorObj?.message || 'Failed to load announcements'} />
        ) : pieData.length === 0 ? (
          <div className="text-center py-8 text-base-content/70">No announcements found.</div>
        ) : (
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={compact ? 220 : 300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={compact ? 70 : 100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <CustomPieLegend payload={pieData.map((d, idx) => ({ value: d.name, color: PIE_COLORS[idx % PIE_COLORS.length] }))} />
          </div>
        )}
      </section>
      {/* Tutors Pie Chart Section */}
      <section
        className={
          compact
            ? "w-full bg-base-100 rounded-md shadow-lg p-4 md:p-6 border border-primary/10"
            : "w-full bg-base-100 rounded-md shadow-lg p-6 md:p-8 border border-primary/10 mt-8"
        }
        aria-label="Tutors by Specialty Statistics"
      >
        <h3 className="text-lg md:text-xl font-bold mb-2 text-primary">Tutors by Specialty</h3>
        <p className="text-base-content/70 mb-4">Distribution of all <span className="font-semibold text-blue-600">{Array.isArray(tutors) ? tutors.length : 0}</span> tutors by their specialty.</p>
        {tutorsLoading ? (
          <Spinner />
        ) : tutorsError ? (
          <ErrorMsg message={tutorsErrorObj?.message || 'Failed to load tutors'} />
        ) : tutorsPieData.length === 0 ? (
          <div className="text-center py-8 text-base-content/70">No specialty data found.</div>
        ) : (
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={compact ? 220 : 300}>
              <PieChart role="img" aria-label="Pie chart of tutors by specialty">
                <Pie
                  data={tutorsPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={compact ? 70 : 100}
                  innerRadius={compact ? 38 : 60}
                  fill={PIE_COLORS[0]}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                  isAnimationActive={true}
                >
                  {tutorsPieData.map((entry, idx) => (
                    <Cell key={`cell-tutors-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} className="transition-all duration-200 hover:opacity-80" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 13 }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <CustomPieLegend payload={tutorsPieData.map((d, idx) => ({ value: d.name, color: PIE_COLORS[idx % PIE_COLORS.length] }))} />
          </div>
        )}
      </section>
    </div>
  );
};

export default PublicStatistics;