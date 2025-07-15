import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const AdminStatistic = ({ stats }) => {
    // Prepare data for charts (exclude average rating)
    const chartData = stats.filter(stat => stat.label !== 'Average Rating').map(stat => ({
        name: stat.label,
        value: Number(stat.value),
    }));

    return (
        <div className="w-full max-w-5xl mx-auto bg-base-100 rounded-md shadow-md p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Platform Statistics Overview</h3>
            {/* Responsive grid: 1 column on mobile, 2 on md+; allow horizontal scroll on xs if needed */}
            <div className="w-full flex flex-col md:grid md:grid-cols-2 gap-8 items-center justify-center overflow-x-auto md:overflow-x-hidden">
                {/* Pie Chart */}
                <div className="w-full min-w-[260px] h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={60}
                                fill="#8884d8"
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Doughnut Chart (Pie with innerRadius) */}
                <div className="w-full min-w-[260px] h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={60}
                                fill="#82ca9d"
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`doughnut-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {/* Vertical Bar Chart */}
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
                {/* Horizontal Bar Chart */}
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
            </div>
        </div>
    );
};

export default AdminStatistic;