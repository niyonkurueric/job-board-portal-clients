import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsData } from '@/types/analytics';

interface AnalyticsState {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setAnalytics(state, action: PayloadAction<AnalyticsData>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setAnalyticsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setAnalyticsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setAnalytics, setAnalyticsLoading, setAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
