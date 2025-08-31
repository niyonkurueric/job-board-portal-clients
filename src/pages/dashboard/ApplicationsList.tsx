import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { fetchUserApplications } from "@/api/applicationsApi";
import { setApplications, setLoading } from "@/store/slices/applicationsSlice";

import { apiFetch } from "@/api/apiFetch";
import JobApplicationsList from "./JobApplicationsList";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building2, Calendar, MapPin, Clock, CheckCircle, XCircle, Users, Eye } from "lucide-react";

// Rendered as cards instead of table

const ApplicationsList = () => {
  const dispatch = useDispatch();
  const { applications, isLoading } = useSelector((state: RootState) => state.applications);
  const user = useSelector((state: RootState) => state.auth.user);

  if (user?.role === "admin") {
    return <JobApplicationsList jobId={null} />;
  }

  useEffect(() => {
    dispatch(setLoading(true));
    const fetchApplications = async () => {
      let apps = [];
      try {
        if (user?.role === "admin") {
          const res: any = await apiFetch(
            `${import.meta.env.VITE_BACKEND_URL||'https://core-server-job-board.vercel.app'}/api/applications`
          );
          apps =
            res && res.success && Array.isArray(res.data)
              ? res.data
              : Array.isArray(res)
              ? res
              : [];
        } else {
          const res: any = await fetchUserApplications();
          apps =
            res && res.success && Array.isArray(res.data)
              ? res.data
              : Array.isArray(res)
              ? res
              : [];
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
            <Building2 className="h-12 w-12 text-gray-300 mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No applications found</h2>
            <p className="text-gray-500">You haven't applied to any jobs yet.</p>
            <Link to="/">
              <Button className="mt-4">Browse Jobs</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app: any) => {
            const jobTitle = app.jobTitle || app.job_title || "Untitled";
            const company = app.company || app.company_name || "Unknown Company";
            const appliedAt = app.appliedDate || app.created_at;
            const status = app.status || "pending";
            const jobId = app.jobId || app.job_id;
            const location = app.location || app.job_location;
            const cvLink = app.cvLink || app.cv_url;


            return (
              <Card
                key={app.id}
                className="bg-white shadow-sm  transition-shadow"
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 border rounded-lg">
                        <Building2 className="h-6 w-6 text-[#3aafef]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {jobTitle}
                        </h3>
                        {/* <p className="text-sm text-gray-600">{company}</p> */}
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                          {location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" /> {location}
                            </span>
                          )}
                          {appliedAt && (
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-4 w-4" />{' '}
                              {new Date(appliedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {cvLink && (
                          <a
                            href={cvLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-[#3aafef] cursor-pointer"
                            >
                              View CV
                            </Button>
                          </a>
                        )}
                        {jobId && (
                          <Link to={`/dashboard/jobs/${jobId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-[#3aafef] cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" /> View Job
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {app.cover_letter || app.coverLetter ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm text-gray-700">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: app.cover_letter || app.coverLetter
                        }}
                      />
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;
