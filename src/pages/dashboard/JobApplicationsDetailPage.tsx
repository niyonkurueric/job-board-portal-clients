import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReusableTable from '@/components/common/ReusableTable';
import { Dialog } from '@/components/ui/dialog';

const JobApplicationsDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const job = location.state?.job;

  if (!job) {
    return <div className="p-8">No job data found.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Applications for: {job.title}</h2>
      <div className="mb-4">
        <div className="text-base font-semibold">Job Description:</div>
        <div dangerouslySetInnerHTML={{ __html: job.description }} />
      </div>
      <div className="max-h-[70vh] overflow-y-auto">
        <ReusableTable
          columns={[
            { key: 'applicant_name', label: 'Name', render: value => value || '-' },
            { key: 'applicant', label: 'Email', render: value => value || '-' },
            { key: 'cover_letter', label: 'Cover Letter', render: value => <div dangerouslySetInnerHTML={{ __html: value || '-' }} /> },
            { key: 'cv_url', label: 'CV', render: value => value ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View CV</a> : '-' },
            { key: 'created_at', label: 'Applied At', render: value => value ? new Date(value).toLocaleString() : '-' },
          ]}
          data={job.applications || []}
          emptyMessage="No user applications found for this job."
        />
      </div>
      <button className="mt-6 px-4 py-2 bg-gray-300 rounded" onClick={() => navigate(-1)}>Back</button>
    </div>
  );
};

export default JobApplicationsDetailPage;
