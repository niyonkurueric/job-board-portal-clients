import React, { useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Calendar, Building2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { fetchPublishedJobs } from "@/store/slices/jobsSlice";

const Index = () => {
  const dispatch = useDispatch();
  const jobs = useSelector((state: RootState) => state.jobs.filteredJobs);
  const isLoading = useSelector((state: RootState) => state.jobs.isLoading);

  useEffect(() => {
    dispatch(fetchPublishedJobs({ page: 1, pageSize: 12 }) as any);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Available Jobs</h1>
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-muted-foreground">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="col-span-full text-center text-muted-foreground">
              No jobs available.
            </div>
          ) : (
            jobs.map((job) => (
              <Card
                key={job.id}
                className="w-full hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                <CardHeader className="pb-2 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-300 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
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
                    <Button size="sm" className="w-full mt-2">
                      View Details
                    </Button>
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
