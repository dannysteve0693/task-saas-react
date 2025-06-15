import { Outlet, useNavigation, useLoaderData } from 'react-router';
import { cn } from '@/lib/utils';

import { SidebarProvider } from '@/components/ui/sidebar';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import AppSidebar from '@/components/AppSidebar';
import { Toaster } from '@/components/ui/sonner';
import { ProjectProvider } from '@/contexts/ProjectContext';

import type { AppLoaderData } from '@/routes/loaders/appLoader';

const AppLayout = () => {
  const navigation = useNavigation();
  const { projects } = useLoaderData<AppLoaderData>();

  const isLoading = navigation.state === 'loading' && !navigation.formData;

  return (
    <ProjectProvider projects={projects}>
      <SidebarProvider>
        <TooltipProvider
          disableHoverableContent
          delayDuration={500}
        >
          <AppSidebar />
          <main
            className={cn(
              'flex-1',
              isLoading && 'opacity-50 pointer-events-none',
            )}
          >
            <Outlet />
          </main>
        </TooltipProvider>
      </SidebarProvider>
      <Toaster />
    </ProjectProvider>
  );
};

export default AppLayout;
