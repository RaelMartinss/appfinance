'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { UserNav } from '@/components/user-nav';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const userData = await response.json();
          if (isMounted) {
            setUser(userData);
            setIsLoading(false);
          }
        } else {
          router.replace('/'); // replace é melhor que push para não poluir o histórico
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        router.replace('/');
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <MobileNav />
      <main className="flex-1 overflow-y-auto bg-background pt-16 lg:pt-0">
        <div className="fixed top-0 right-0 p-4 z-50 lg:p-6">
          <UserNav user={user} />
        </div>
        {children}
      </main>
    </div>
  );
}