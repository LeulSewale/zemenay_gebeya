'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeAuth } from '@/store/slices/authSlice';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  return null;
}

