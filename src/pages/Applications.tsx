import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Calendar, 
  MapPin, 
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Eye
} from 'lucide-react';

const Applications = () => {
  const { userApplications } = useSelector((state: RootState) => state.applications);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Please log in to view your job applications.
            </p>
            <Link to="/login">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'reviewed':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'accepted':
        return 'bg-success/10 text-success border-success/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'reviewed':
        return <Users className="h-4 w-4" />;
      case 'accepted':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your application is being reviewed';
      case 'reviewed':
        return 'Application under review by hiring team';
      case 'accepted':
        return 'Congratulations! Your application was accepted';
      case 'rejected':
        return 'Application was not successful this time';
      default:
        return 'Application status unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            My Applications
          </h1>
          <p className="text-muted-foreground mt-2">
            Track the status of your job applications
          </p>
        </div>

        {userApplications.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No Applications Yet
              </h3>
              <p className="text-muted-foreground mb-6">
                You haven't applied to any jobs yet. Start exploring
                opportunities!
              </p>
              <Link to="/" className="bg-[#3aafef]">
                <Button>Browse Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {userApplications.map((application) => (
              <Card
                key={application.id}
                className="bg-gradient-card shadow-card hover:shadow-elegant transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gradient-primary rounded-lg">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground">
                          {application.jobTitle}
                        </h3>
                        <p className="text-muted-foreground font-medium">
                          {application.company}
                        </p>
                        <div className="flex items-center space-x-1 mt-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Applied on{' '}
                            {new Date(
                              application.appliedDate
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-3">
                      <Link to={`/job/${application.jobId}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-[#3aafef]"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Job
                        </Button>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {getStatusMessage(application.status)}
                    </p>
                    {application.status === 'accepted' && (
                      <p className="text-sm text-success mt-1">
                        The hiring team will contact you soon with next steps.
                      </p>
                    )}
                    {application.status === 'rejected' && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Don't give up! Keep applying to other opportunities.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-center pt-6">
              <Link to="/">
                <Button variant="outline">Find More Jobs</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;