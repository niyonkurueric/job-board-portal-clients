import { Job } from '@/store/slices/jobsSlice';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building2, Calendar, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobCardProps {
  job: Job;
}

const JobCard = ({ job }: JobCardProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-success/10 text-success border-success/20';
      case 'Part-time':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'Contract':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'Remote':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className="hover:shadow-elegant transition-all duration-300 bg-gradient-card border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-transparent rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-[#222a5f]" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">
                {job.title}
              </h3>
              <p className="text-muted-foreground font-medium">{job.company}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{job.location}</span>
          </div>
          {job.created_at && (
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <Link to={`/job/${job.id}`}>
          <Button
            size="sm"
            className="w-full mt-2 bg-[#3aafef] hover:bg-[ #358cbbff] text-white font-semibold rounded-sm"
          >
            Apply
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default JobCard;