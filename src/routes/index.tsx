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
    loader: todayTaskLoader
  }
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
  },
]);

export default router;
