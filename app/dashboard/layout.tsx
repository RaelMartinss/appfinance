'use client';


import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { UserNav } from '@/components/user-nav';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   // Fetch user data
  //   const fetchUser = async () => {
  //     const response = await fetch('/api/user');
  //     if (response.ok) {
  //       const userData = await response.json();
  //       setUser(userData);
  //     } else {
  //       router.push('/login');
  //     }
  //   };

  //   fetchUser();
  // }, [router]);

  // const handleLogout = async () => {
  //   const response = await fetch('/api/auth/logout', { method: 'POST' });
  //   if (response.ok) {
  //     router.push('/login');
  //   }
  // };

  useEffect(() => {
    // Check if user is already logged in
    fetch('/api/auth/me')
      .then(res => {
        if (res.ok) {
          router.push('/dashboard');
        }
      });
  }, [router]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
       
      <Sidebar />
      <MobileNav />
      <main className="flex-1 overflow-y-auto bg-background pt-16 lg:pt-0">
        <div className="fixed top-0 right-0 p-4 z-50 lg:p-6">
          <UserNav />
        </div>
        {children}
      </main>
      
    </div>
  );
}