'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProductPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home since create product is now handled by a modal
    router.replace('/');
  }, [router]);

  return null;
}

