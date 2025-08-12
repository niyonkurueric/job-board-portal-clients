

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Application } from '@/types/application';

export interface ApplicationsState {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

const initialState: ApplicationsState = {
  applications: [],
  loading: false,
  error: null,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    fetchApplicationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchApplicationsSuccess(state, action: PayloadAction<Application[]>) {
      state.applications = action.payload;
      state.loading = false;
    },
    fetchApplicationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchApplicationsStart, fetchApplicationsSuccess, fetchApplicationsFailure } = applicationsSlice.actions;
export default applicationsSlice.reducer;
