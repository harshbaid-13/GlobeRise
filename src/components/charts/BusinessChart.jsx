import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const BusinessChart = ({ data }) => {
    return (
        <div className="bg-[#1a1f2e] p-6 rounded-lg border border-[#374151] shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6">Business Growth</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                        <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af' }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value / 1000}k`}
                        />
                        <Tooltip
                            cursor={{ fill: '#252a3a' }}
                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend />
                        <Bar dataKey="direct" name="Direct Business" fill="#10b981" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="team" name="Team Business" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BusinessChart;
