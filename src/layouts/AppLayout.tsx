import React from 'react';
import { Outlet, useNavigation } from 'react-router';
import { cn } from '@/lib/utils';

import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from "@/components/ui/sonner"

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading' && !navigation.formData

  return (
    <>
      <SidebarProvider>
        <TooltipProvider
          disableHoverableContent
          delayDuration={500}
        >
          <AppSidebar />
          <main className={cn('flex-1', isLoading && 'opacity-50 pointer-events-none')}>
            <Outlet />
          </main>
        </TooltipProvider>
      </SidebarProvider>
      <Toaster />
    </>
  );
};

export default AppLayout;
