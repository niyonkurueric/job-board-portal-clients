import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Calendar, Building2, Clock, ExternalLink } from 'lucide-react';
import { fetchJobById, applyToJob } from '@/api/jobsApi';
import { AppModal } from '../common/AppModal';

const JobDetails = () => {
  const { id } = useParams();
  const matchApply = useMatch('/dashboard/jobs/:id/apply');
  const [isApplicationOpen, setIsApplicationOpen] = useState(!!matchApply);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const job = useSelector((state: RootState) =>
    state.jobs.jobs.find((j) => j.id === Number(id))
  );
  // Get current user info from auth slice
  const user = useSelector((state: RootState) => state.auth?.user);
  const [loading, setLoading] = useState(!job);

  useEffect(() => {
    if (!job && id) {
      setLoading(true);
      fetchJobById(id)
        .then((jobDataRaw) => {
          let jobData = jobDataRaw as any;
          if (jobData && typeof jobData === 'object' && 'data' in jobData && jobData.data) {
            jobData = jobData.data;
          }
          if (jobData && jobData.id) {
            dispatch({ type: 'jobs/addJob', payload: jobData });
          }
        })
        .finally(() => setLoading(false));
    } else if (job) {
      setLoading(false);
    }
  }, [id, job, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-12 h-12 text-gray-400" />
          </div>
          <p className="text-xl text-gray-600 font-medium">Job not found</p>
          <p className="text-gray-500 mt-2">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const jobDate = new Date(dateString);
    const diffInMs = now.getTime() - jobDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6 backdrop-blur-sm">
              <Briefcase className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {job.title}
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-6 text-lg opacity-90">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{getTimeAgo(job.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Job Description - Main Content */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
              <CardHeader className="border-b border-gray-100 pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-white" />
                  </div>
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="prose prose-gray max-w-none">
                  <div
                    className="bg-gray-50 rounded-xl p-6 text-gray-700 leading-relaxed text-base min-h-[200px] border border-gray-100"
                    dangerouslySetInnerHTML={{ __html: job.description || 'No description available for this position.' }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Apply Button (only for non-admin users) */}
            {user?.role !== 'admin' && (
              <div className="mt-8">
                <Button 
                  onClick={() => {
                    setIsApplicationOpen(true);
                    navigate(`/dashboard/jobs/${id}/apply`);
                  }}
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Apply for this Position
                </Button>
              </div>
            )}
          </div>

          {/* Job Info Sidebar */}
          <div className="space-y-6">
            {/* Job Details Card */}
            <Card className="shadow-xl border-0 bg-white backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold text-gray-900">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Company</p>
                    <p className="text-gray-700">{job.company}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-700">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900">Posted</p>
                    <p className="text-gray-700">{formatDate(job.created_at)}</p>
                    <p className="text-sm text-gray-500">{getTimeAgo(job.created_at)}</p>
                  </div>
                </div>
                {'deadline' in job && job.deadline && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900">Deadline</p>
                      <p className="text-gray-700">{formatDate(job.deadline as string)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {user?.role !== 'admin' && (
        <AppModal
          open={isApplicationOpen}
          onOpenChange={(open) => {
            setIsApplicationOpen(open);
            if (!open) navigate(`/dashboard/jobs/${id}`);
          }}
          title="Apply for Position"
        >
          <ApplyJobForm jobId={id} job={job} onClose={() => {
            setIsApplicationOpen(false);
            navigate(`/dashboard/jobs/${id}`);
          }} />
        </AppModal>
      )}
    </div>
  );
};

// Add ApplyJobForm component below
type ApplyJobFormProps = {
  jobId: string;
  job: any;
  onClose: () => void;
};

const ApplyJobForm: React.FC<ApplyJobFormProps> = ({ jobId, job, onClose }) => {
  const [cvLink, setCvLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    if (!cvLink || !coverLetter) {
      setError('Please provide both CV/Resume link and cover letter.');
      setIsSubmitting(false);
      return;
    }
    try {
      await applyToJob(jobId, { cvLink, coverLetter });
      setSuccess('Application submitted successfully!');
      setCvLink('');
      setCoverLetter('');
      setTimeout(onClose, 1500);
    } catch (err) {
      setError('Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job?.title}</h2>
        <p className="text-gray-600 text-lg">{job?.company}</p>
        <p className="text-sm text-gray-500">{job?.location}</p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            CV/Resume Link *
          </label>
          <input
            type="url"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="https://your-resume-link.com"
            value={cvLink}
            onChange={e => setCvLink(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cover Letter *
          </label>
          <textarea
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="Tell us why you're the perfect fit for this role..."
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default JobDetails;