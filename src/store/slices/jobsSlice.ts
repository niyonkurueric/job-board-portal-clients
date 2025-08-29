import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchPublishedJobs as fetchPublishedJobsApi } from '@/api/jobsApi';

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  created_at?: string;
  created_by?: number;
  status: 'draft' | 'published';
}

interface JobsState {
  jobs: Job[];
  filteredJobs: Job[];
  selectedJob: Job | null;
  searchQuery: string;
  selectedType: string;
  selectedLocation: string;
  isLoading: boolean;
}

const initialState: JobsState = {
  jobs: [],
  filteredJobs: [],
  selectedJob: null,
  searchQuery: '',
  selectedType: '',
  selectedLocation: '',
  isLoading: false,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.jobs = action.payload;
      state.filteredJobs = action.payload;
      state.isLoading = false;
    },
    addJob: (state, action: PayloadAction<Job>) => {
      state.jobs.push(action.payload);
      state.filteredJobs = state.jobs.filter(job =>
        job.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(state.searchQuery.toLowerCase())
      );
    },
    setSelectedJob: (state, action: PayloadAction<Job | null>) => {
      state.selectedJob = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredJobs = state?.jobs?.filter(job =>
        job.title.toLowerCase().includes(action.payload.toLowerCase()) ||
        job.company.toLowerCase().includes(action.payload.toLowerCase()) ||
        job.location.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setSelectedType: (state, action: PayloadAction<string>) => {
      state.selectedType = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublishedJobs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPublishedJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.jobs = action.payload;
        state.filteredJobs = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPublishedJobs.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const {
  setJobs,
  addJob,
  setSelectedJob,
  setSearchQuery,
  setSelectedType,
  setSelectedLocation,
  setLoading,
} = jobsSlice.actions;

export default jobsSlice.reducer;

export const fetchPublishedJobs = createAsyncThunk('jobs/fetchPublished', async ({ page = 1, pageSize = 10, search, location }: { page?: number; pageSize?: number; search?: string; location?: string } = {}) => {
  const res = await fetchPublishedJobsApi(page, pageSize, { search, location });
  // API may return either { success, data } or a raw array; normalize
  if ((res as any)?.success && Array.isArray((res as any).data)) {
    return (res as any).data as Job[];
  }
  return (res as any) as Job[];
});