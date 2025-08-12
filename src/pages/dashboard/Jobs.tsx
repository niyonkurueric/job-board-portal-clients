import React from 'react';
import JobTabs from '@/components/dashboard/JobTabs';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';


const DashboardJobs = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const jobs = useSelector((state: RootState) => state.jobs.jobs);
  if (!user) {
    return <div className="text-center py-8 text-gray-500">You do not have access to this page.</div>;
  }
  const isAdmin = user.role === 'admin';
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{isAdmin ? 'Job Management' : 'All Jobs'}</h2>
      <JobTabs
        jobs={jobs}
        onCreate={isAdmin ? (() => {}) : undefined}
        onEdit={isAdmin ? (() => {}) : undefined}
        onDelete={isAdmin ? (() => {}) : undefined}
        userRole={user.role}
      />
    </div>
  );
};

export default DashboardJobs;
