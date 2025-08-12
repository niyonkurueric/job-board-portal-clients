import React, { useState, useEffect } from 'react';
import { Briefcase, Upload, FileText, CheckCircle, AlertCircle, ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchJobById } from '@/api/jobsApi';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { applicationSchema } from '@/schema/applicationSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import JoditEditor from 'jodit-react';
import configStyles from '@/components/common/configuration';
import { applyForJob } from '@/api/applicationsApi';
import { useToast } from '@/components/ui/use-toast';

const ApplyJobPage = () => {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use Redux for job data, but fetch if not present
  const job = useSelector((state: RootState) =>
    state.jobs.jobs.find((j) => String(j.id) === String(id))
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      cvLink: '',
      coverLetter: '',
    },
  });

  const applicationError = useSelector((state: RootState) => state.applications);
// If your applicationsSlice uses error, make sure it's defined in ApplicationsState. If not, remove the optional chaining.
  const coverLetterValue = watch('coverLetter') || '';

  useEffect(() => {
    if (!job && id) {
      fetchJobById(id).then((jobDataRaw) => {
        let jobData = jobDataRaw as any;
        if (jobData && typeof jobData === 'object' && 'data' in jobData && jobData.data) {
          jobData = jobData.data;
        }
        if (jobData && jobData.id) {
          dispatch({ type: 'jobs/addJob', payload: jobData });
        }
      });
    }
  }, [id, job, dispatch]);

  const onSubmit = async (data) => {

    try {
      if (id) {
        await applyForJob({
          jobId: String(id),
          cover_letter: data.coverLetter,
          cv_url: data.cvLink,
        });
        toast({
          title: 'Success',
          description: 'Application submitted successfully!',
          variant: 'default',
        });
      }
    } catch (error) {
      let errorMsg = 'Failed to submit application.';
      if (error && error.message) errorMsg = error.message;
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      dispatch({ type: 'applications/fetchApplicationsFailure', payload: errorMsg });
    }
  };

  // Back to jobs button handler
  const handleBack = () => {
    if (id) {
      navigate(`/dashboard/jobs/${id}`);
    } else {
      navigate('/dashboard/jobs');
    }
  };

  const InputField = ({ name, label, type = 'text', placeholder, required = true, ...props }) => {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <input
            type={type}
            {...register(name)}
            placeholder={placeholder}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              errors[name]
                ? 'border-red-300 bg-red-50 focus:border-red-500'
                : 'border-gray-200 focus:border-blue-500'
            }`}
            {...props}
          />
          {errors[name] && (
            <AlertCircle className="absolute right-3 top-3 w-5 h-5 text-red-500" />
          )}
        </div>
        {errors[name] && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {errors[name].message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{job?.title}</h1>
              <p className="text-blue-100 text-lg">{job?.company}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job?.location}
            </div>
          </div>
        </div>
        <div className="p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Application Materials
              </h3>
              <div className="space-y-4">
                <InputField
                  name="cvLink"
                  label="CV/Resume Link"
                  type="url"
                  placeholder="https://drive.google.com/your-resume"
                  {...register('cvLink')}
                  error={errors.cvLink?.message}
                />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <JoditEditor
                    value={coverLetterValue}
                    onBlur={newContent => setValue('coverLetter', newContent)}
                    onChange={newContent => setValue('coverLetter', newContent)}
                    config={configStyles}
                  />
                  {errors.coverLetter && (
                    <p className="text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.coverLetter.message}
                    </p>
                  )}
                  <div className="flex justify-end text-sm text-gray-500">
                    <span>{typeof coverLetterValue === 'string' ? coverLetterValue.length : 0}/500</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Submitting Application...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyJobPage;