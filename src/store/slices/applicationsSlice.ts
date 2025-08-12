import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  userEmail: string;
  jobTitle: string;
  company: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
  cvLink?: string;
  coverLetter?: string;
}

interface ApplicationsState {
  applications: Application[];
  userApplications: Application[];
  isLoading: boolean;
}

const initialState: ApplicationsState = {
  applications: [],
  userApplications: [],
  isLoading: false,
};

const applicationsSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    setApplications: (state, action: PayloadAction<Application[]>) => {
      state.applications = action.payload;
    },
    setUserApplications: (state, action: PayloadAction<Application[]>) => {
      state.userApplications = action.payload;
    },
    addApplication: (state, action: PayloadAction<Application>) => {
      state.applications.push(action.payload);
      state.userApplications.push(action.payload);
    },
    updateApplicationStatus: (state, action: PayloadAction<{ id: string; status: Application['status'] }>) => {
      const application = state.applications.find(app => app.id === action.payload.id);
      if (application) {
        application.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setApplications,
  setUserApplications,
  addApplication,
  updateApplicationStatus,
  setLoading,
} = applicationsSlice.actions;

export default applicationsSlice.reducer;