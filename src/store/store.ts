import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import jobsSlice from './slices/jobsSlice';
import applicationsSlice from './slices/applicationsSlice';
import analyticsSlice from './slices/analyticsSlice';
import usersSlice from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobsSlice,
    applications: applicationsSlice,
    analytics: analyticsSlice,
    users: usersSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;