'use client';
import PostForm from '@/app/admin/dashboard/post/_components/post-form';
import PostListingPage from '@/app/admin/dashboard/post/_components/post-listing-page';
import KBar from '@/components-admin/kbar';
import AppSidebar from '@/components-admin/layout/app-sidebar';
import Header from '@/components-admin/layout/header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <>{children}</>;
      case 'employee':
        return <PostListingPage />;
      default:
        return <>{children}</>;
    }
  };

  return (
    <KBar>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar onPageChange={(page) => setCurrentPage(page)} />
        <SidebarInset>
          <Header />
          {renderContent()}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
