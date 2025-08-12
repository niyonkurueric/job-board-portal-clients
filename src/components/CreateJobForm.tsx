import { useState } from 'react';
import { jobSchema } from '@/schema/jobSchema';
import type { CreateJobFormData, CreateJobResponse } from '@/types/job';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import JoditEditor from 'jodit-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Job } from '@/store/slices/jobsSlice';
import { createJob, updateJob } from '@/api/jobsApi';
import configStyles from './common/configuration';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface CreateJobFormProps {
  onSuccess?: () => void;
  job?: Partial<Job> | null;
}

const CreateJobForm = ({ onSuccess, job }: CreateJobFormProps) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateJobFormData>({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    description: job?.description || '',
    deadline: (job && 'deadline' in job && job.deadline) ? new Date(job.deadline as string) : null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string | string[]>>({});
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string | Date | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  } 
  // For JoditEditor
  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, description: value }));
  } 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormErrors({});

    // Validate with zod
    const result = jobSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors;
      setFormErrors(fieldErrors);
      toast({
        title: "Validation Error",
        description: Object.values(fieldErrors).flat().join(' '),
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      let data;
      if (job && job.id) {
        // Update job
        data = await updateJob(job.id, formData) as CreateJobResponse;
        toast({
          title: "Job Updated Successfully!",
          description: `${data?.title || formData.title} has been updated.`,
        });
      } else {
        // Create job
        data = await createJob(formData) as CreateJobResponse;
        toast({
          title: "Job Created Successfully!",
          description: `${data?.title || formData.title} has been added to the job listings.`,
        });
        setFormData({ title: '', company: '', location: '', description: '', deadline: null });
      }
      onSuccess?.();
    } catch (error) {
      toast({
        title: job && job.id ? "Error Updating Job" : "Error Creating Job",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-1 bg-gray-50">
      <Card className="bg-gradient-card w-full max-w-2xl min-w-[400px] max-h-[80vh] flex flex-col shadow-xl">
        <CardHeader className="flex-shrink-0 border-b bg-white rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {job ? 'Edit Job' : 'Create New Job Posting'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Job Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  required
                  aria-invalid={!!formErrors.title}
                  className="transition-colors focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.title && (
                  <div className="text-xs text-red-500 mt-1">
                    {Array.isArray(formErrors.title) ? formErrors.title[0] : formErrors.title}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company *
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="e.g. TechCorp Inc."
                  required
                  aria-invalid={!!formErrors.company}
                  className="transition-colors focus:ring-2 focus:ring-blue-500"
                />
                {formErrors.company && (
                  <div className="text-xs text-red-500 mt-1">
                    {Array.isArray(formErrors.company) ? formErrors.company[0] : formErrors.company}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location *
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="e.g. San Francisco, CA"
                required
                aria-invalid={!!formErrors.location}
                className="transition-colors focus:ring-2 focus:ring-blue-500"
              />
              {formErrors.location && (
                <div className="text-xs text-red-500 mt-1">
                  {Array.isArray(formErrors.location) ? formErrors.location[0] : formErrors.location}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Job Description *
              </Label>
              <div className="border rounded-lg overflow-hidden bg-white">
                <JoditEditor
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  config={configStyles}
                />
              </div>
              {formErrors.description && (
                <div className="text-xs text-red-500 mt-1">
                  {Array.isArray(formErrors.description) ? formErrors.description[0] : formErrors.description}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium text-gray-700">
                Job Deadline *
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Input
                    id="deadline"
                    type="text"
                    value={formData.deadline ? formData.deadline.toLocaleDateString() : ''}
                    onClick={() => setCalendarOpen(true)}
                    readOnly
                    placeholder="Select deadline date"
                    required
                    className="cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 shadow-lg">
                  <Calendar
                    mode="single"
                    selected={formData.deadline}
                    onSelect={date => {
                      handleInputChange('deadline', date);
                      setCalendarOpen(false);
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.deadline && (
                <div className="text-xs text-red-500 mt-1">
                  {Array.isArray(formErrors.deadline) ? formErrors.deadline[0] : formErrors.deadline}
                </div>
              )}
            </div>
          </form>
        </CardContent>
        
        {/* Fixed Footer with Submit Button */}
        <div className="flex-shrink-0 border-t bg-gray-50 p-6 rounded-b-lg">
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting} 
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50" 
            size="lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {job ? 'Updating Job...' : 'Creating Job...'}
              </div>
            ) : (
              job ? 'Update Job' : 'Create Job Posting'
            )}
          </Button>
        </div>
      </Card>
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default CreateJobForm;