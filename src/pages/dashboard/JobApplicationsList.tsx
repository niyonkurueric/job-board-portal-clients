import React, { useEffect, useState } from "react";
import { AppModal } from "@/components/common/AppModal";
import ResponsiveDataTable from "@/components/common/ResponsiveDataTable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAdminApplications } from "@/api/applicationsApi";
import { setApplications, setLoading } from "@/store/slices/applicationsSlice";
import { Eye } from "lucide-react";

const JobApplicationsList = ({ jobId }) => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state: RootState) => state.applications);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [viewJob, setViewJob] = useState(null);

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
    setShowConfirm(false);
    setDeleteId(null);
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

  // Transform columns for react-data-table-component
  const columns = [
    {
      name: "Job Title",
      selector: (row: any) => row.title || row.jobTitle || "-",
      sortable: true,
      cell: (row: any) => (
        <div className="font-medium text-gray-900">{row.title || row.jobTitle || "-"}</div>
      ),
      width: "25%",
    },
    {
      name: "Company",
      selector: (row: any) => row.company || row.company_name || "-",
      sortable: true,
      cell: (row: any) => (
        <div className="text-gray-700">{row.company || row.company_name || "-"}</div>
      ),
      width: "20%",
    },
    {
      name: "Location",
      selector: (row: any) => row.location || row.job_location || "-",
      sortable: true,
      cell: (row: any) => (
        <div className="text-gray-600 max-w-xs truncate">
          {row.location || row.job_location || "-"}
        </div>
      ),
      width: "20%",
    },
    {
      name: "Applications",
      selector: (row: any) => row.totalApplicants || row.applications_count || 0,
      sortable: true,
      cell: (row: any) => (
        <div className="font-medium text-gray-700">
          {row.totalApplicants || row.applications_count || 0}
        </div>
      ),
      width: "15%",
    },
    {
      name: "Actions",
      selector: () => null,
      sortable: false,
      cell: (row: any) => (
        <button
          className="px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
          onClick={() => setViewJob(row)}
        >
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
        </button>
      ),
      width: "20%",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold mb-4">Applications for this Job</h2>

      <ResponsiveDataTable
        columns={columns}
        data={applications}
        title="Job Applications"
        searchable={true}
        pagination={true}
        selectableRows={false}
        loading={isLoading}
        exportable={false}
      />

      {showConfirm && (
        <AppModal open={showConfirm} onOpenChange={setShowConfirm} title="Delete Application">
          <div className="p-4 min-w-[300px]">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete this application?
            </h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </AppModal>
      )}

      {/* Modal for viewing user applications */}
      {viewJob && (
        <AppModal open={!!viewJob} onOpenChange={setViewJob} title="User Applications">
          <div className="max-h-[70vh] overflow-y-auto">
            {Array.isArray(viewJob.applications) && viewJob.applications.length > 0 ? (
              <div className="space-y-6">
                {viewJob.applications.map((app, idx) => (
                  <div key={app.id || idx} className="border rounded-lg p-4 bg-gray-50">
                    <div className="font-semibold text-base mb-2">{app.applicant_name || "-"}</div>
                    <div className="text-sm text-gray-700 mb-1">Email: {app.applicant || "-"}</div>
                    <div className="text-sm text-gray-700 mb-1">
                      Applied At: {app.created_at ? new Date(app.created_at).toLocaleString() : "-"}
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      CV:{" "}
                      {app.cv_url ? (
                        <a
                          href={app.cv_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View CV
                        </a>
                      ) : (
                        "-"
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="font-semibold">Cover Letter:</div>
                      <div
                        className="prose max-w-full"
                        dangerouslySetInnerHTML={{
                          __html: app.cover_letter || "-",
                        }}
                      />
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
