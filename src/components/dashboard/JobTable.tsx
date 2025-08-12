import React from 'react';
import { Briefcase, Pencil, Trash2, Eye } from 'lucide-react';
import DataTable from './DataTable';

const JobTable = ({ jobs, onEdit, onDelete, onView }) => {
  if (!jobs) return <div className="text-gray-500">No jobs to display.</div>;

  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value, row) => (
        <span className="font-medium flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-500" /> {value}
        </span>
      ),
    },
    { key: 'company', label: 'Company' },
    { key: 'location', label: 'Location' },
    // { key: 'posted', label: 'Posted' },
  ];

  const actions = [
    onView && {
      label: 'View',
      onClick: onView,
      icon: Eye,
      iconClassName: 'w-4 h-4 text-green-600',
      className: 'p-1 rounded hover:bg-green-100',
    },
    onEdit && {
      label: 'Edit',
      onClick: onEdit,
      icon: Pencil,
      iconClassName: 'w-4 h-4 text-blue-600',
      className: 'p-1 rounded hover:bg-blue-100',
    },
    onDelete && {
      label: 'Delete',
      onClick: onDelete,
      icon: Trash2,
      iconClassName: 'w-4 h-4 text-red-600',
      className: 'p-1 rounded hover:bg-red-100',
    },
  ].filter(Boolean);

  return <DataTable columns={columns} data={jobs} actions={actions} />;
};

export default JobTable;
