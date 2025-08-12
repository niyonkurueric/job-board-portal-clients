import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { decodeJwt } from '@/types/jwt';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}


interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Store user and token in localStorage
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('token', action.payload.token);
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
    loadUserFromStorage: (state) => {
      const user = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (user && token) {
        const payload = decodeJwt(token);
        const now = Math.floor(Date.now() / 1000);
        if (payload && payload.exp && payload.exp > now) {
          state.user = JSON.parse(user);
          state.token = token;
          state.isAuthenticated = true;
        } else {
          // Token expired
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;