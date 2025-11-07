import { authApi } from './api';
import { AppStore } from '@/store/store';
import { setTokens, logout } from '@/store/slices/authSlice';

/**
 * Refresh the access token using the refresh token
 * @param store - Redux store instance
 * @param expiresInMins - Optional expiration time in minutes (default: 30)
 * @returns Promise<boolean> - Returns true if refresh was successful, false otherwise
 */
export async function refreshAccessToken(
  store: AppStore,
  expiresInMins: number = 30
): Promise<boolean> {
  try {
    const state = store.getState();
    const refreshToken = state.auth.refreshToken;

    if (!refreshToken) {
      console.warn('No refresh token available');
      return false;
    }

    const response = await authApi.refreshToken(refreshToken, expiresInMins);
    
    // Update tokens in store
    store.dispatch(setTokens({
      token: response.accessToken,
      refreshToken: response.refreshToken,
    }));

    return true;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    // If refresh fails, logout the user
    store.dispatch(logout());
    return false;
  }
}

/**
 * Check if token is expired (basic check - JWT tokens have expiration in payload)
 * Note: This is a simple check. For production, decode JWT and check exp claim
 */
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  
  try {
    // Decode JWT payload (base64)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    
    if (!exp) return false; // No expiration claim
    
    // Check if token is expired (with 60 second buffer)
    return Date.now() >= (exp * 1000) - 60000;
  } catch (e) {
    // If we can't decode, assume it's valid (might not be a JWT)
    return false;
  }
}

