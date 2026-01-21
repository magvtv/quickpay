'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuthStore } from '@/stores/authStore';
import InvoiceDrawer from '@/components/invoices/InvoiceDrawer';
import InvoiceModal from '@/components/invoices/InvoiceModal';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, isLoading, initializeAuth } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client-side mount
  useEffect(() => {
    setMounted(true);
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      // router.push('/login');
      // For now, allow access without auth for development
    }
  }, [user, isLoading, router, mounted]);

  // Render consistent layout on server and initial client render
  // This prevents hydration mismatch
  if (!mounted) {
    return (
      <>
        <div className="flex min-h-screen bg-[var(--primary-blue)]">
          <Sidebar />
          <div className="flex-1 ml-64 my-0">
            <div className="min-h-screen bg-white rounded-l-[2rem] shadow-xl">
              <TopBar />
              <main className="p-8">
                {children}
              </main>
            </div>
          </div>
        </div>
        
        {/* Global Modals */}
        <InvoiceDrawer />
        <InvoiceModal />
      </>
    );
  }

  // After mounting, can show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Main layout (works with or without user for development)
  return (
    <>
      <div className="flex min-h-screen bg-[var(--primary-blue)]">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 ml-64 my-0">
          <div className="min-h-screen bg-white rounded-l-[2rem] shadow-xl">
            <TopBar />
            <main className="p-8">
              {children}
            </main>
          </div>
        </div>
      </div>

      {/* Global Modals */}
      <InvoiceDrawer />
      <InvoiceModal />
    </>
  );
}
