import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import useAxios from '../../hooks/useAxios';

const COLORS = ['#6366F1', '#F59E42', '#10B981', '#F43F5E', '#A21CAF', '#FBBF24', '#0EA5E9', '#E11D48', '#84CC16', '#F472B6', '#14B8A6', '#FACC15'];

const PublicStatistics = () => {
  const axiosInstance = useAxios();
  // Sessions for BarChart
  const { data: sessionData } = useQuery({
    queryKey: ['public-sessions', 1],
    queryFn: async () => {
      const res = await axiosInstance('/public-sessions?page=1&limit=12');
      return res.data;
    },
  });
  // Announcements for PieChart
  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await axiosInstance('/announcements');
      return res.data;
    },
  });
  // Tutors for PieChart
  const { data: tutors } = useQuery({
    queryKey: ['tutors'],
    queryFn: async () => {
      const res = await axiosInstance('/tutors');
      return res.data;
    },
  });

  // Prepare BarChart/LineChart data
  let chartData = [];
  if (sessionData && sessionData.sessions) {
    chartData = sessionData.sessions.map((session, idx) => ({
      name: session.title?.slice(0, 12) || `Session ${idx + 1}`,
      value: session.registrationFee || 0,
      uv: session.duration || 0, // Example: use duration as 'uv'
      pv: session.registrationFee || 0, // Example: use registrationFee as 'pv'
    }));
  }

  // Prepare PieChart data (announcements by category)
  let pieData = [];
  if (announcements && Array.isArray(announcements)) {
    const categoryCount = {};
    announcements.forEach(a => {
      const cat = a.category || 'Uncategorized';
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });
    pieData = Object.entries(categoryCount).map(([cat, count]) => ({ name: cat, value: count }));
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
    <div className="w-full max-w-5xl mx-auto bg-base-100 rounded-md shadow-md p-4 sm:p-6">
      <h3 className="text-lg font-semibold mb-4 text-center">Platform Public Statistics</h3>
      <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-8 items-center justify-center overflow-x-auto md:overflow-x-hidden">
        {/* Pie Chart (Announcements) */}
        <div className="w-full min-w-[260px] h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Doughnut Chart (Tutors) */}
        <div className="w-full min-w-[260px] h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={tutorsPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                fill="#82ca9d"
                label
              >
                {tutorsPieData.map((entry, index) => (
                  <Cell key={`doughnut-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Vertical Bar Chart (Sessions) */}
        <div className="w-full min-w-[260px] h-60 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {chartData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Horizontal Bar Chart (Sessions) */}
        <div className="w-full min-w-[260px] h-60 sm:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 10 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#ffc658">
                {chartData.map((entry, index) => (
                  <Cell key={`hbar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Line Chart (Full width, only on lg+) */}
        <div className="hidden lg:block md:col-span-2 w-full h-80 mt-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="uv" stroke="#8884d8" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pv" stroke="#82ca9d" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PublicStatistics;