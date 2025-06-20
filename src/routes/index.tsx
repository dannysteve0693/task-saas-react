import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';

import HomePage from '@/pages/HomePage';
import RootErrorBoundary from '@/pages/RootErrorBoundary';

import type { RouteObject } from 'react-router';
import RegisterPage from '@/pages/RegisterPage';
import LoginPage from '@/pages/LoginPage';
import AuthSyncPage from '@/pages/AuthSyncPage';
import AppLayout from '@/layouts/AppLayout';
import InboxPage from '@/pages/InboxPage';
import appAction from './actions/appAction';

import inboxTaskLoader from './loaders/inboxLoader';
import TodayTaskPage from '@/pages/TodayTaskPage';
import todayTaskLoader from './loaders/todayTaskLoader';
import UpcomingTaskPage from '@/pages/UpcomingTaskPage';
import upcomingTaskLoader from './loaders/upcomingTaskLoader';
import CompletedTaskPage from '@/pages/CompletedTaskPage';
import completedTaskLoader from './loaders/completedTaskLoader';
import projectAction from './actions/projectAction';
import ProjectPage from '@/pages/ProjectPage';
import projectsLoader from './loaders/projectsLoader';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import projectDetailLoader from './loaders/projectDetailLoader';
import appLoader from './loaders/appLoader';
import ProjectErrorBoundary from '@/pages/ProjectErrorBoundary';

const rootRouteChildren: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'auth-sync',
    element: <AuthSyncPage />,
  },
];
const appRouteChildren: RouteObject[] = [
  {
    path: 'inbox',
    element: <InboxPage />,
    loader: inboxTaskLoader,
  },
  {
    path: 'today',
    element: <TodayTaskPage />,
    loader: todayTaskLoader,
  },
  {
    path: 'upcoming',
    element: <UpcomingTaskPage />,
    loader: upcomingTaskLoader,
  },
  {
    path: 'completed',
    element: <CompletedTaskPage />,
    loader: completedTaskLoader,
  },
  {
    path: 'projects',
    element: <ProjectPage />,
    action: projectAction,
    loader: projectsLoader,
  },
  {
    path: 'projects/:projectId',
    element: <ProjectDetailPage />,
    loader: projectDetailLoader,
    errorElement: <ProjectErrorBoundary />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RootErrorBoundary />,
    children: rootRouteChildren,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: appRouteChildren,
    action: appAction,
    loader: appLoader,
  },
]);

export default router;
