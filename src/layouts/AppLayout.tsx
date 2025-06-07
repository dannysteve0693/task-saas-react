import React from 'react';
import { Outlet } from 'react-router';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import AppSidebar from '@/components/AppSidebar';

const AppLayout = () => {
  return (
    <SidebarProvider>
      <TooltipProvider
        disableHoverableContent
        delayDuration={500}
      >
        <AppSidebar />
        <SidebarTrigger />
        <div>AppLayout</div>
        <Outlet />
      </TooltipProvider>
    </SidebarProvider>
  );
};

export default AppLayout;
