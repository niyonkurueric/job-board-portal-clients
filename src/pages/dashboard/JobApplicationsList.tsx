import React, { useEffect, useState } from 'react';
import { AppModal } from '@/components/common/AppModal';
import ReusableTable from '@/components/common/ReusableTable';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { fetchAdminApplications } from '@/api/applicationsApi';
import { setApplications, setLoading } from '@/store/slices/applicationsSlice';

const columns = [
  { key: 'title', label: 'Job Title', render: value => value || '-' },
  { key: 'company', label: 'Company name', render: value => value || '-' },
  { key: 'location', label: 'Location', render: value => <span className="max-w-xs truncate" dangerouslySetInnerHTML={{ __html: value || '-' }} /> },
  { key: 'deadline', label: 'Application Deadline', render: value => value ? new Date(value).toLocaleString() : '-' },
];

const JobApplicationsList = ({ jobId }) => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state: RootState) => state.applications);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [viewJob, setViewJob] = useState(null); // job object to view applications

  useEffect(() => {
    dispatch(setLoading(true));
    fetchAdminApplications()
      .then((apps) => {
        dispatch(setApplications(apps));
      })
      .catch(() => {
        dispatch(setApplications([]));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    // TODO: Replace with your delete API and Redux logic
    // await dispatch(deleteApplication(deleteId));
    setShowConfirm(false);
    setDeleteId(null);
    // Optionally, refetch applications after delete
    dispatch(setLoading(true));
    fetchAdminApplications()
      .then((apps) => {
        dispatch(setApplications(apps));
      })
      .catch(() => {
        dispatch(setApplications([]));
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const columnsWithActions = [
    ...columns,
    {
      key: 'view',
      label: 'View',
      render: (_, row) => (
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setViewJob(row)}
        >
          View
        </button>
      ),
    },
    {
      key: 'delete',
      label: 'Delete',
      render: (_, row) => (
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => handleDelete(row.id)}
        >
          Delete
        </button>
      ),
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Applications for this Job</h2>
      {isLoading && <div>Loading...</div>}
      <ReusableTable columns={columnsWithActions} data={applications} emptyMessage="No applications found for this job." />
      {showConfirm && (
        <AppModal open={showConfirm} onOpenChange={setShowConfirm} title="Delete Application">
          <div className="p-4 min-w-[300px]">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this application?</h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={confirmDelete}>Yes, Delete</button>
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal for viewing user applications only, using AppModal */}
      {viewJob && (
        <AppModal open={!!viewJob} onOpenChange={setViewJob} title="User Applications">
          <div className="max-h-[70vh] overflow-y-auto">
            {Array.isArray(viewJob.applications) && viewJob.applications.length > 0 ? (
              <div className="space-y-6">
                {viewJob.applications.map((app, idx) => (
                  <div key={app.id || idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="font-semibold text-base mb-2">{app.applicant_name || '-'}</div>
                    <div className="text-sm text-gray-700 mb-1">Email: {app.applicant || '-'}</div>
                    <div className="text-sm text-gray-700 mb-1">Applied At: {app.created_at ? new Date(app.created_at).toLocaleString() : '-'}</div>
                    <div className="text-sm text-gray-700 mb-1">CV: {app.cv_url ? <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View CV</a> : '-'}</div>
                    <div className="mt-2">
                      <div className="font-semibold">Cover Letter:</div>
                      <div className="prose max-w-full" dangerouslySetInnerHTML={{ __html: app.cover_letter || '-' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No user applications found for this job.</div>
            )}
          </div>
        </AppModal>
      )}
    </div>
  );
};

export default JobApplicationsList;
