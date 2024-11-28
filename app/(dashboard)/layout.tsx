import { Sidebar } from '@/components/sidebar';
import { MobileNav } from '@/components/mobile-nav';
import { UserNav } from '@/components/user-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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