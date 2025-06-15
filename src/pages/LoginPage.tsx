import Head from '@/components/Head';

import { SignIn } from '@clerk/clerk-react';

const LoginPage = () => {
  return (
    <>
      <Head title='Login to Task AI - Manage Your To-Do Lists and Projects' />

      <section className=''>
        <div className='container flex justify-center'>
          <SignIn signUpUrl='/register' />
        </div>
      </section>
    </>
  );
};

export default LoginPage;
