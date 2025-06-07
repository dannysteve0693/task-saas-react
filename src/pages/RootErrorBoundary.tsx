import React from 'react';

import { isRouteErrorResponse, useRouteError, Link } from 'react-router';

import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const RootErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className='min-h-[100dvh] flex flex-col'>
      <Header />
      <div className='grow container'>
        <h1 className=''>
          {isRouteErrorResponse(error)
            ? 'Hmmm, that page doesn’t exist.'
            : 'Something went wrong'}
        </h1>

        <p className=''>
          {isRouteErrorResponse(error)
            ? 'You can get back on track and manage your tasks with ease.'
            : 'We`re working on fixing this issue. Please try again later.'}
        </p>

        <div className=''>
          <Button asChild>
            <Link to={'/'}>Return to Home</Link>
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RootErrorBoundary;
