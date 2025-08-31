import React, { useEffect } from 'react';
import { Briefcase, FileText, Users, Heart, TrendingUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { useNavigate } from 'react-router-dom';
import AnalyticsCharts from './ui/AnalyticsCharts';
import { fetchAnalytics } from '@/api/analyticsApi';
import { setAnalytics, setAnalyticsLoading, setAnalyticsError } from '@/store/slices/analyticsSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const analytics = useSelector((state: RootState) => state.analytics.data);
  const analyticsLoading = useSelector((state: RootState) => state.analytics.loading);
  const analyticsError = useSelector((state: RootState) => state.analytics.error);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.role === 'admin') {
      dispatch(setAnalyticsLoading(true));
      fetchAnalytics()
        .then((res) => dispatch(setAnalytics((res as any)?.data ?? res)))
        .catch((err) => dispatch(setAnalyticsError(err.message || 'Failed to fetch analytics')));
    }
  }, [dispatch, user]);

  if (!user) return null;

  const isAdmin = user.role === 'admin';

  // Stats only for admin users
  const adminStats = [
    { title: 'Total Jobs', value: analytics?.jobs ?? '—', icon: Briefcase, color: 'blue' },
    { title: 'Applications', value: analytics?.applications ?? '—', icon: FileText, color: 'green' },
    { title: 'Active Users', value: analytics?.users ?? '—', icon: Users, color: 'purple' },
  ];

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 lg:p-8">
          {!isAdmin && (
            <div className="mb-8">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      Welcome to JobBoard Portal! 👋
                    </h1>
                    <p className="text-lg text-gray-600 mb-1">
                      Hello, {user.name || user.email}
                    </p>
                    <p className="text-gray-500">
                      {isAdmin
                        ? 'Manage your job board and track analytics from your admin dashboard.'
                        : 'Discover new opportunities and manage your job applications.'}
                    </p>
                  </div>
                  <div className="hidden md:flex items-center space-x-2 text-[#3aafef]">
                    {/* <Heart className="w-6 h-6" /> */}
                    <span className="text-sm font-medium">
                      {isAdmin ? 'Admin Panel' : 'Job Seeker'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid - Only for Admin */}
          {isAdmin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {adminStats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center bg-${stat.color}-100`}
                  >
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </div>
                    <div className="text-gray-500 text-sm">{stat.title}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Actions for Non-Admin Users */}
          {!isAdmin && (
            <div className="mb-10">
              <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Find Your Dream Job
                </h3>
                <p className="text-gray-600 text-lg mb-2">
                  Start exploring opportunities today
                </p>
                <p className="text-gray-500">
                  Click on Jobs tab to see all available jobs
                </p>
              </div>
            </div>
          )}

          {/* Analytics Section - Only for Admin */}
          {isAdmin && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Analytics Overview
              </h3>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {analyticsLoading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-gray-500">Loading analytics...</div>
                  </div>
                )}
                {analyticsError && (
                  <div className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">
                    {analyticsError}
                  </div>
                )}
                {analytics && <AnalyticsCharts data={analytics} />}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;