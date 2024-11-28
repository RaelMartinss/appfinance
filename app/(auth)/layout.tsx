"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          router.push('/');
        }
      });
  }, [router]);

  return children;
}