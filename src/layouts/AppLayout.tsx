import React from 'react';
import { Outlet } from 'react-router';

import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from "@/components/ui/sonner"

const AppLayout = () => {
  return (
    <>
      <SidebarProvider>
        <TooltipProvider
          disableHoverableContent
          delayDuration={500}
        >
          <AppSidebar />
          <main className='flex-1'>
            <Outlet />
          </main>
        </TooltipProvider>
      </SidebarProvider>
      <Toaster />
    </>
  );
};

export default AppLayout;
