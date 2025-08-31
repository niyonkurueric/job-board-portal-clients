import React, { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { fetchJobs, fetchPublishedJobs } from "@/api/jobsApi";
import { fetchUserApplications } from "@/api/applicationsApi";
import ResponsiveDataTable from "@/components/common/ResponsiveDataTable";
import { Eye, Pencil, Trash2, Send, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setUserApplications } from "@/store/slices/applicationsSlice";

interface JobsListWithSearchProps {
  onEdit?: (job: any) => void;
  onDelete?: (job: any) => void;
  onView?: (job: any) => void;
  userRole?: string;
}

const JobsListWithSearch = forwardRef<any, JobsListWithSearchProps>(
  ({ onEdit, onDelete, onView, userRole }, ref) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userApplications = useSelector((state: RootState) => state.applications.userApplications);

    const loadJobs = () => {
      setLoading(true);
      const loader = userRole === "admin" ? fetchJobs() : fetchPublishedJobs(1, 50);
      Promise.resolve(loader)
        .then((data) => {
          if (Array.isArray(data)) {
            setJobs(data);
          } else if (Array.isArray((data as any)?.jobs)) {
            setJobs((data as any).jobs);
          } else if (typeof data === "object" && data !== null) {
            const arr = Object.values(data).find((v) => Array.isArray(v));
            setJobs(arr || []);
          }
        })
        .catch(() => setError("Failed to fetch jobs"))
        .finally(() => setLoading(false));
    };

    useEffect(() => {
      loadJobs();
    }, []);

    // Ensure user applications are loaded to properly hide Apply when already applied
    useEffect(() => {
      const loadUserApplicationsIfNeeded = async () => {
        if (
          userRole !== "admin" &&
          (!Array.isArray(userApplications) || userApplications.length === 0)
        ) {
          try {
            const res: any = await fetchUserApplications();
            const apps =
              res && res.success && Array.isArray(res.data)
                ? res.data
                : Array.isArray(res)
                ? res
                : [];
            dispatch(setUserApplications(apps as any));
          } catch {
            dispatch(setUserApplications([] as any));
          }
        }
      };
      loadUserApplicationsIfNeeded();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userRole]);

    useImperativeHandle(ref, () => ({
      reload: () => {
        setRefreshKey((prev) => prev + 1);
        loadJobs();
      },
    }));

    // Transform columns for react-data-table-component
    const columns = [
      {
        name: "Title",
        selector: (row: any) => row.title,
        sortable: true,
        cell: (row: any) => <div className="font-medium text-gray-900">{row.title}</div>,
        width: "30%",
      },
      {
        name: "Company",
        selector: (row: any) => row.company,
        sortable: true,
        cell: (row: any) => <div className="text-gray-700">{row.company}</div>,
        width: "25%",
      },
      {
        name: "Location",
        selector: (row: any) => row.location,
        sortable: true,
        cell: (row: any) => <div className="text-gray-600">{row.location}</div>,
        width: "18%",
      },
      // Only show status for admin users
      ...(userRole === "admin"
        ? [
            {
              name: "Status",
              selector: (row: any) => row.status || "draft",
              sortable: true,
              cell: (row: any) => {
                const status = row.status || "draft";
                const statusConfig = {
                  draft: { icon: Clock, color: "text-gray-600", bg: "bg-gray-100" },
                  published: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
                  active: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
                  pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-100" },
                  closed: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
                };
                const config = statusConfig[status] || statusConfig.draft;

                return (
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}
                  >
                    <config.icon className="h-4 w-4" />
                    <span className="capitalize">{status}</span>
                  </div>
                );
              },
              width: "15%",
            },
          ]
        : []),
      {
        name: "Actions",
        selector: () => null,
        sortable: false,
        cell: (row: any) => (
          <div className="flex items-center gap-2">
            {onView && (
              <button
                onClick={() => onView(row)}
                className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                title="View details"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}

            {userRole !== "admin" &&
              (!Array.isArray(userApplications) ||
              !userApplications.some(
                (a) => String(a.jobId) === String(row.id) || String(a?.jobId) === String(row.id)
              ) ? (
                <button
                  onClick={() => navigate(`/dashboard/jobs/${row.id}/apply`)}
                  className="px-3 py-2 rounded-lg bg-[#3aafef] text-white font-medium hover:bg-[#0a7fbd] transition-colors flex items-center gap-2"
                  title="Apply Now"
                >
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">Apply</span>
                </button>
              ) : (
                <span className="px-3 py-2 rounded-lg bg-gray-100 text-gray-500 text-sm">
                  Applied
                </span>
              ))}

            {onEdit && userRole === "admin" && (
              <button
                onClick={() => onEdit(row)}
                className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                title="Edit"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}

            {onDelete && userRole === "admin" && (
              <button
                onClick={() => onDelete(row)}
                className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ),
        width: "20%",
      },
    ];

    const handleExport = () => {
      // Export jobs to CSV (without description)
      const csvContent = [
        ["Title", "Company", "Location", "Status"],
        ...jobs.map((job) => [
          job.title || "",
          job.company || "",
          job.location || "",
          job.status || "draft",
        ]),
      ]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "jobs.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    };

    if (error) {
      return <div className="text-center py-8 text-red-500 bg-red-50 rounded-lg">{error}</div>;
    }

    return (
      <ResponsiveDataTable
        key={refreshKey}
        columns={columns}
        data={jobs}
        title="Jobs"
        searchable={true}
        pagination={true}
        selectableRows={false}
        loading={loading}
        exportable={true}
        onExport={handleExport}
      />
    );
  }
);

JobsListWithSearch.displayName = "JobsListWithSearch";

export default JobsListWithSearch;
