import { configureStore } from '@reduxjs/toolkit';
import jobsReducer from '../features/jobs/jobsSlice';
import authReducer from '../features/auth/authSlice';
import applicationsReducer from '../features/applications/applicationsSlice';

export const store = configureStore({
  reducer: {
    jobs: jobsReducer,
    auth: authReducer,
    applications: applicationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
