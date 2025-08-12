import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { fetchJobs } from '@/api/jobsApi';
import DataTable from './DataTable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Send } from 'lucide-react'; // Added Send for Apply
import { useNavigate } from 'react-router-dom';

interface JobsListWithSearchProps {
  onEdit?: (job: any) => void;
  onDelete?: (job: any) => void;
  onView?: (job: any) => void;
  userRole?: string;
}

const JobsListWithSearch = forwardRef<any, JobsListWithSearchProps>(({ onEdit, onDelete, onView, userRole }, ref) => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadJobs = () => {
    setLoading(true);
    fetchJobs()
      .then((data) => {
        if (Array.isArray(data)) {
          setJobs(data);
        } else if (Array.isArray((data as any)?.jobs)) {
          setJobs((data as any).jobs);
        } else if (typeof data === 'object' && data !== null) {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          setJobs(arr || []);
        } else {
          setJobs([]);
        }
      })
      .catch(() => setError('Failed to fetch jobs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  useImperativeHandle(ref, () => ({
    reload: loadJobs,
  }));

  const filteredJobs = Array.isArray(jobs)
    ? jobs.filter((job) => {
        const title = job?.title || '';
        const company = job?.company || '';
        const location = job?.location || '';
        const q = search.toLowerCase();
        return (
          title.toLowerCase().includes(q) ||
          company.toLowerCase().includes(q) ||
          location.toLowerCase().includes(q)
        );
      })
    : [];

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'company', label: 'Company' },
    { key: 'location', label: 'Location' },
  ];

  const actions = [
    onView && {
      label: 'View',
      onClick: onView,
      icon: Eye,
      iconClassName: 'w-4 h-4 text-green-600',
      className: 'p-1 rounded hover:bg-green-100',
    },
    userRole !== 'admin' && {
      label: 'Apply',
      onClick: (job) => {
        navigate(`/dashboard/jobs/${job.id}/apply`);
      },
      icon: Send, // Changed from Eye to Send
      iconClassName: 'w-4 h-4 text-blue-600',
      className: 'p-1 rounded hover:bg-blue-100',
    },
    onEdit && userRole === 'admin' && {
      label: 'Edit',
      onClick: onEdit,
      icon: Pencil,
      iconClassName: 'w-4 h-4 text-blue-600',
      className: 'p-1 rounded hover:bg-blue-100',
    },
    onDelete && userRole === 'admin' && {
      label: 'Delete',
      onClick: onDelete,
      icon: Trash2,
      iconClassName: 'w-4 h-4 text-red-600',
      className: 'p-1 rounded hover:bg-red-100',
    },
  ].filter(Boolean);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Input
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={() => setSearch('')} variant="outline" size="sm">
          Clear
        </Button>
      </div>
      {loading ? (
        <div className="text-center py-8">Loading jobs...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No jobs found.</div>
      ) : (
        <DataTable columns={columns} data={filteredJobs} actions={actions} />
      )}
    </div>
  );
});

export default JobsListWithSearch;
