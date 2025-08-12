import React, { useState, useRef } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import JobsListWithSearch from './JobsListWithSearch';
import { useNavigate } from 'react-router-dom';
import CreateJobForm from '../CreateJobForm';
import { AppModal } from '../common/AppModal';
import { deleteJob } from '@/api/jobsApi';

const JobTabs = ({ jobs, onCreate, onEdit = undefined, onDelete, userRole }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const navigate = useNavigate();

  const handleViewJob = (job) => {
    navigate(`/dashboard/jobs/${job.id}`);
  };

  // Handler to edit job
  const handleEditJob = (job) => {
    setEditJob(job);
    setShowEditModal(true);
  };

  // Ref to trigger reload in JobsListWithSearch
  const jobsListRef = useRef(null);
  const [pendingDeleteJob, setPendingDeleteJob] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleJobCreated = () => {
    setShowCreateModal(false);
    // Call reload on JobsListWithSearch
    if (jobsListRef.current && typeof jobsListRef.current.reload === 'function') {
      jobsListRef.current.reload();
    }
  };

  // Handler for delete icon
  const handleDeleteJob = (job) => {
    setPendingDeleteJob(job);
    setShowDeleteDialog(true);
  };

  const confirmDeleteJob = async () => {
    if (pendingDeleteJob) {
      await deleteJob(pendingDeleteJob.id);
      setShowDeleteDialog(false);
      setPendingDeleteJob(null);
      // Reload job list
      if (jobsListRef.current && typeof jobsListRef.current.reload === 'function') {
        jobsListRef.current.reload();
      }
    }
  };

  // Removed confirmDelete, handled in handleDeleteJob

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-gray-800">Job List</h4>
        {onCreate && (
          <button
            className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Job
          </button>
        )}
      </div>
      <JobsListWithSearch
        ref={jobsListRef}
        onEdit={userRole === 'admin' ? handleEditJob : undefined}
        onDelete={userRole === 'admin' ? handleDeleteJob : undefined}
        onView={handleViewJob}
        userRole={userRole}
      />
      {/* Modal for creating job (admin only) */}
      {onCreate && (
        <AppModal
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
          title="Create New Job"
        >
          <CreateJobForm onSuccess={handleJobCreated} />
        </AppModal>
      )}
      {/* Modal for editing job (admin only) */}
      {onEdit && (
        <AppModal
          open={showEditModal && !!editJob}
          onOpenChange={setShowEditModal}
          title="Edit Job"
        >
          <CreateJobForm onSuccess={() => setShowEditModal(false)} job={editJob} />
        </AppModal>
      )}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteJob} className="bg-red-500 text-white hover:bg-red-600">Yes, Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default JobTabs;
