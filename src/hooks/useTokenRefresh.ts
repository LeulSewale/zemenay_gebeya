'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppStore } from '@/store/hooks';
import { refreshAccessToken, isTokenExpired } from '@/lib/auth';

/**
 * Hook to automatically refresh tokens when they expire
 * Checks token expiration every 5 minutes and refreshes if needed
 */
export function useTokenRefresh() {
  const token = useAppSelector((state) => state.auth.token);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const store = useAppStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !token || !refreshToken) {
      // Clear interval if not authenticated
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Check token expiration immediately
    if (isTokenExpired(token)) {
      refreshAccessToken(store);
    }

    // Set up interval to check token expiration every 5 minutes
    intervalRef.current = setInterval(() => {
      const currentToken = store.getState().auth.token;
      if (currentToken && isTokenExpired(currentToken)) {
        refreshAccessToken(store);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAuthenticated, token, refreshToken, store]);
}

