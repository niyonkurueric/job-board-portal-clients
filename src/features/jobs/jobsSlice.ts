import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
}

interface JobsState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobsState = {
  jobs: [],
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    fetchJobsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchJobsSuccess(state, action: PayloadAction<Job[]>) {
      state.jobs = action.payload;
      state.loading = false;
    },
    fetchJobsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchJobsStart, fetchJobsSuccess, fetchJobsFailure } = jobsSlice.actions;
export default jobsSlice.reducer;
