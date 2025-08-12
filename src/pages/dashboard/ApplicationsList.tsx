import React, { useEffect } from 'react';
import ReusableTable from '@/components/common/ReusableTable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchUserApplications } from '@/api/applicationsApi';
import { setApplications, setLoading } from '@/store/slices/applicationsSlice';

import { apiFetch } from '@/api/apiFetch';
import JobApplicationsList from './JobApplicationsList';

const columns = [
  {
    key: 'job_title',
    label: 'Job Title',
    render: (value) => value || '-',
  },
  {
    key: 'cv_url',
    label: 'CV',
    render: (value) =>
      value ? (
        <a
          href={value}
          className="text-blue-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View CV
        </a>
      ) : (
        '-'
      ),
  },
  {
    key: 'cover_letter',
    label: 'Cover Letter',
    render: (value) => (
      <span
        className="max-w-xs truncate"
        dangerouslySetInnerHTML={{ __html: value || '-' }}
      />
    ),
  },
  {
    key: 'created_at',
    label: 'Applied',
    render: (value) => (value ? new Date(value).toLocaleString() : '-'),
  },
];

const ApplicationsList = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state: RootState) => state.applications);
  const user = useSelector((state: RootState) => state.auth.user);

  if (user?.role === 'admin') {
    return <JobApplicationsList jobId={null} />;
  }

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchApplications = async () => {
      let apps = [];
      try {
        if (user?.role === 'admin') {
          const res: any = await apiFetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600'}/api/applications`);
          apps = res && res.success && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        } else {
          const res: any = await fetchUserApplications();
          apps = res && res.success && Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        }
        dispatch(setApplications(apps));
      } catch {
        dispatch(setApplications([]));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchApplications();
  }, [dispatch, user?.role]);

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      {isLoading && <div>Loading...</div>}
      {applications.length === 0 && !isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-300 mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 018 0v2M9 17H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2M9 17v2a2 2 0 002 2h2a2 2 0 002-2v-2" />
            </svg>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No applications found</h2>
            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
          </div>
        </div>
      ) : (
        <ReusableTable columns={columns} data={applications} emptyMessage="No applications found." />
      )}
    </div>
  );
};

export default ApplicationsList;
