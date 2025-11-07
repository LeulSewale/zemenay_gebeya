import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.isAuthenticated = true;
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_user', JSON.stringify(action.payload.user));
        if (action.payload.refreshToken) {
          localStorage.setItem('auth_refresh_token', action.payload.refreshToken);
        }
      }
    },
    setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', action.payload.token);
        localStorage.setItem('auth_refresh_token', action.payload.refreshToken);
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_refresh_token');
      }
    },
    initializeAuth: (state) => {
      // Initialize auth from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const refreshToken = localStorage.getItem('auth_refresh_token');
        const userStr = localStorage.getItem('auth_user');
        if (token && userStr) {
          try {
            state.token = token;
            state.refreshToken = refreshToken;
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
          } catch (e) {
            // Invalid data, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_refresh_token');
          }
        }
      }
    },
  },
});

export const { setCredentials, setTokens, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;

