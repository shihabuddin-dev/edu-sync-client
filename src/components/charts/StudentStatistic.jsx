import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F'];

const StudentStatistic = ({ stats }) => {
    // Prepare data for the charts (exclude average rating)
    const chartData = stats.filter(stat => stat.label !== 'Average Rating').map(stat => ({
        name: stat.label,
        value: Number(stat.value),
    }));

    return (
        <div className="w-full max-w-5xl mx-auto mt-10 bg-base-100 rounded-md shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Statistics Overview</h3>
            <div className="w-full flex flex-col md:flex-row gap-8 items-center justify-center overflow-x-auto md:overflow-x-hidden">
                {/* Pie Chart */}
                <div className="w-full min-w-[260px] h-78 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
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
                {/* Bar Chart */}
                <div className="w-full min-w-[260px] h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
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
            </div>
        </div>
    );
};

export default StudentStatistic;