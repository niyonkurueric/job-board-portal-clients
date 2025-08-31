import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { setSelectedJob } from "@/store/slices/jobsSlice";
import { applyToJob } from "@/api/jobsApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { fetchJobById } from "@/api/jobsApi";
import { fetchUserApplications } from "@/api/applicationsApi";
import { setUserApplications } from "@/store/slices/applicationsSlice";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  MapPin,
  Building2,
  User,
  FileText,
  ExternalLink,
  Clock,
  Users,
} from "lucide-react";

const JobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [hasApplied, setHasApplied] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cvLink: "",
    coverLetter: "",
  });
  const [jobApplications, setJobApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);

  const { jobs, selectedJob } = useSelector((state: RootState) => state.jobs);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { userApplications } = useSelector((state: RootState) => state.applications);

  // Ensure user's applications are loaded so we can accurately detect hasApplied
  useEffect(() => {
    const ensureUserApplications = async () => {
      try {
        if (
          isAuthenticated &&
          (!Array.isArray(userApplications) || userApplications.length === 0)
        ) {
          const res: any = await fetchUserApplications();
          const apps =
            res && res.success && Array.isArray(res.data)
              ? res.data
              : Array.isArray(res)
              ? res
              : [];
          dispatch(setUserApplications(apps));
        }
      } catch {
        // ignore
      }
    };
    ensureUserApplications();
  }, [isAuthenticated, dispatch]);

  useEffect(() => {
    if (!id) return;
    let job = jobs.find((j) => String(j.id) === String(id));
    if (job) {
      dispatch(setSelectedJob(job));
      const applied = userApplications.some(
        (app) => String((app as any).jobId ?? (app as any).job_id) === String(id)
      );
      setHasApplied(applied);
      setLoadingApplications(true);
      fetchJobById(id)
        .then((jobDataRaw) => {
          let jobData = jobDataRaw as any;
          if (jobData && typeof jobData === "object" && "data" in jobData && jobData.data) {
            jobData = jobData.data;
          }
          if (jobData) {
            setJobApplications(jobData.applications || []);
          } else {
            setJobApplications([]);
          }
        })
        .catch(() => setJobApplications([]))
        .finally(() => setLoadingApplications(false));
    } else {
      fetchJobById(id)
        .then((jobDataRaw) => {
          let jobData = jobDataRaw as any;
          if (jobData && typeof jobData === "object" && "data" in jobData && jobData.data) {
            jobData = jobData.data;
          }
          if (jobData && jobData.id) {
            dispatch(setSelectedJob(jobData));
            const applied = userApplications.some(
              (app) => String((app as any).jobId ?? (app as any).job_id) === String(jobData.id)
            );
            setHasApplied(applied);
            setJobApplications(jobData.applications || []);
          } else {
            dispatch(setSelectedJob(null));
            setJobApplications([]);
          }
        })
        .catch(() => {
          dispatch(setSelectedJob(null));
          setJobApplications([]);
        });
    }
  }, [id, jobs, dispatch, userApplications]);

  const handleApplicationSubmit = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!selectedJob || !user) return;

    try {
      await applyToJob(String(selectedJob.id), {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        cvLink: applicationData.cvLink || undefined,
        coverLetter: applicationData.coverLetter || undefined,
      });
      setHasApplied(true);
      setIsApplicationOpen(false);
      setApplicationData({
        cvLink: "",
        coverLetter: "",
      });
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully.",
      });
      navigate("/jobs");
    } catch (error: any) {
      let errorMsg = error?.message || "Could not submit your application. Please try again.";
      if (error && (error.status === 409 || /UNIQUE constraint/i.test(String(error.message)))) {
        errorMsg = "You have already applied to this job.";
      }
      toast({
        title: "Application Failed",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  if (!selectedJob) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-lg text-slate-600">Job not found</p>
          <Button onClick={() => navigate("/jobs")} variant="outline">
            Browse All Jobs
          </Button>
        </div>
      </div>
    );
  }

  // User view: can apply (admins cannot apply)
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#222a5f] via-[#222a5f] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {selectedJob.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-lg mb-6">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>{selectedJob.company}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{selectedJob.location}</span>
                  </div>
                  {selectedJob.created_at && (
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-5 h-5" />
                      <span>
                        Posted{' '}
                        {new Date(selectedJob.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Card */}
              <div className="lg:w-80">
                <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Ready to Apply?
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Join our team and make an impact
                      </p>
                    </div>
                    {isAuthenticated && !hasApplied && (
                      <Button
                        onClick={() => {
                          if (!isAuthenticated) {
                            navigate('/login', {
                              state: { fromApply: true, jobId: selectedJob.id }
                            });
                          } else {
                            navigate(`/dashboard/jobs/${selectedJob.id}/apply`);
                          }
                        }}
                        disabled={hasApplied}
                        className="w-full bg-gradient-to-r   from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                      >
                        Apply Now
                      </Button>
                    )}
                    {isAuthenticated && hasApplied && (
                      <p className="text-center text-sm text-green-600 mt-3 font-medium">
                        Application submitted successfully!
                      </p>
                    )}
                    {!isAuthenticated && (
                      <Button
                        onClick={() =>
                          navigate('/login', {
                            state: { fromApply: true, jobId: selectedJob.id }
                          })
                        }
                        variant="outline"
                        className="w-full hover:bg-[#3aafef]"
                      >
                        Sign in to Apply
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Job Description */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Job Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray max-w-none">
                    <div
                      className="text-gray-700 leading-relaxed whitespace-pre-line text-base space-y-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedJob.description ||
                          'No description available for this position.'
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {/* Job Info */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Job Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{selectedJob.company}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{selectedJob.location}</p>
                    </div>
                  </div>
                  <Separator />
                  {selectedJob.created_at && (
                    <>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Posted</p>
                          <p className="font-medium">
                            {new Date(
                              selectedJob.created_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}
                  {selectedJob.created_by && (
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500">Created by</p>
                        <p className="font-medium text-xs">
                          User ID: {selectedJob.created_by}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Share */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    Share this job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-[#3aafef]"
                    onClick={() =>
                      navigator.clipboard.writeText(window.location.href)
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ...existing code... */}
      </div>
    );
  }

  // Admin view: see all applications
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-4"></div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">{selectedJob.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-slate-300">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span>{selectedJob.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{selectedJob.location}</span>
            </div>
            {selectedJob.created_at && (
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4" />
                <span>Posted {new Date(selectedJob.created_at).toLocaleDateString()}</span>
              </div>
            )}
            {selectedJob.created_by && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Created by User ID: {selectedJob.created_by}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Description */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Applications Summary */}
          <div>
            <Card className="shadow-lg border-0 bg-white mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-600" />
                  Applications Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {jobApplications.length}
                  </div>
                  <p className="text-gray-600">Total Applications</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
