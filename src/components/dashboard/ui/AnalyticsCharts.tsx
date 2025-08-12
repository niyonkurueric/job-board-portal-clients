import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, Legend } from 'recharts';
import { AnalyticsData } from '@/types/analytics';

interface AnalyticsChartsProps {
  data: any;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  // If monthly breakdown is not available, show a single bar/point
  const jobsData = Array.isArray(data.jobsLast6Months)
    ? data.jobsLast6Months
    : [{ month: 'Last 6 Months', jobs: data.jobsPostedLast6Months || 0 }];
  const applicationsData = Array.isArray(data.applicationsLast6Months)
    ? data.applicationsLast6Months
    : [{ month: 'Last 6 Months', applications: data.applicationsReceivedLast6Months || 0 }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-4">Jobs Posted (Last 6 Months)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={jobsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="jobs" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-4">Applications Received (Last 6 Months)</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={applicationsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="applications" fill="#22d3ee" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
