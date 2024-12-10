"use client";
import Navbar from '@/app/components/navbar/Navbar';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import HeroSection from '@/app/home/components/HeroSection';
import PostSection from '@/app/home/components/PostSection';
import KBar from '@/components-admin/kbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components-admin/layout/app-sidebar';
import { Header } from '@radix-ui/react-accordion';
import OverViewPage from '@/app/admin/overview/_components/overview';

const Page = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <OverViewPage/>
        </SidebarInset>
      </SidebarProvider>
  );
};

export default Page;
