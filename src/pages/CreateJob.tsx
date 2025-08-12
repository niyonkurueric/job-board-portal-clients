import { useNavigate } from 'react-router-dom';
import CreateJobForm from '@/components/CreateJobForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreateJob = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl min-w-[400px] min-h-[700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Create New Job</h1>
          <p className="text-muted-foreground mt-2">
            Add a new job posting to attract qualified candidates
          </p>
        </div>

        <CreateJobForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default CreateJob;