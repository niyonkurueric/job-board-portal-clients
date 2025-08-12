
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Building2 } from 'lucide-react';

const Index = () => {
  const [jobs, setJobs] = useState([]);
  useEffect(() => {
    // Fetch jobs from backend
    fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:7600'}/api/jobs`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.data)) {
          setJobs(data.data);
        } else if (Array.isArray(data)) {
          setJobs(data);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Available Jobs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {jobs.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">No jobs available.</div>
          ) : (
            jobs.map(job => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border border-gray-200">
                <CardHeader className="pb-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-300 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    {job.created_at && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    )}
                    <Link to={`/job/${job.id}`}>
                      <Button size="sm" className="w-full mt-2">View Details</Button>
                    </Link>
                  </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
