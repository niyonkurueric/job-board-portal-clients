import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchPublishedJobs } from "@/store/slices/jobsSlice";
import SearchSection from "@/components/SearchSection";
import JobCard from "@/components/JobCard";

const Jobs = () => {
  const dispatch = useDispatch();
  const { filteredJobs, isLoading, searchQuery, selectedLocation } = useSelector(
    (state: RootState) => state?.jobs
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    dispatch(
      fetchPublishedJobs({
        page,
        pageSize: 10,
        search: searchQuery || undefined,
        location: selectedLocation || undefined,
      }) as any
    );
  }, [dispatch, page, searchQuery, selectedLocation]);

  return (
    <div className="min-h-screen bg-background">
      <SearchSection />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Available Jobs</h2>
            <p className="text-muted-foreground mt-2">
              {filteredJobs?.length} job{filteredJobs?.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Array.isArray(filteredJobs) ? filteredJobs : []).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}

        {!isLoading && filteredJobs?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No jobs found matching your criteria.</p>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center mt-8">
          <button
            className="px-4 py-2 mx-1 rounded bg-primary text-white disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 mx-1">
            Page {page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 mx-1 rounded bg-primary text-white disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
