import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, Users, Briefcase, FileText } from "lucide-react";

interface AnalyticsChartsProps {
  data: any;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data }) => {
  // Process data to avoid duplication and make it more meaningful
  const jobsData = Array.isArray(data.jobsLast6Months) && data.jobsLast6Months.length > 0
    ? data.jobsLast6Months
    : [{ month: "Current", jobs: data.jobs || 0 }];

  const applicationsData = Array.isArray(data.applicationsLast6Months) && data.applicationsLast6Months.length > 0
    ? data.applicationsLast6Months
    : [{ month: "Current", applications: data.applications || 0 }];

  // Create summary metrics for better understanding
  const summaryMetrics = [
    {
      title: "Total Jobs",
      value: data.jobs || 0,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Applications",
      value: data.applications || 0,
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Active Users",
      value: data.users || 0,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Application Rate",
      value: data.jobs && data.applications ? Math.round((data.applications / data.jobs) * 100) : 0,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      suffix: "%",
    },
  ];

  // Custom tooltip formatter
  const formatTooltipValue = (value: any, name: string) => {
    if (typeof value === "number") {
      return [value.toLocaleString(), name];
    }
    return [value, name];
  };

  // Custom Y-axis formatter
  const formatYAxis = (tickItem: any) => {
    return tickItem.toLocaleString();
  };

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8">
      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryMetrics.map((metric, index) => (
          <div
            key={metric.title}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value.toLocaleString()}
                  {metric.suffix && <span className="text-lg ml-1">{metric.suffix}</span>}
                </p>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Jobs Trend Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-lg text-gray-800">Jobs Posted Trend</h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Jobs Posted</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={jobsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="jobs"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Applications Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-lg text-gray-800">Applications Received</h4>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span>Applications</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={applicationsData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                axisLine={{ stroke: "#e5e7eb" }}
              />
              <Tooltip
                formatter={formatTooltipValue}
                labelStyle={{ color: "#374151", fontWeight: "600" }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Bar dataKey="applications" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold text-lg text-gray-800 mb-6">Data Distribution Overview</h4>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h5 className="font-medium text-gray-700 mb-4 text-center">Jobs vs Applications Ratio</h5>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Jobs', value: data.jobs || 0 },
                    { name: 'Applications', value: data.applications || 0 },
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {COLORS.map((color, index) => (
                    <Cell key={`cell-${index}`} fill={color} />
                  ))}
                </Pie>
                <Tooltip formatter={formatTooltipValue} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="text-center">
              <h6 className="font-medium text-gray-600 mb-2">Key Insights</h6>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-700">Jobs Posted:</span>
                  <span className="font-semibold text-blue-900">{data.jobs || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700">Applications:</span>
                  <span className="font-semibold text-green-900">{data.applications || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-purple-700">Active Users:</span>
                  <span className="font-semibold text-purple-900">{data.users || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-orange-700">Avg. Applications per Job:</span>
                  <span className="font-semibold text-orange-900">
                    {data.jobs && data.applications ? Math.round((data.applications / data.jobs) * 10) / 10 : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
