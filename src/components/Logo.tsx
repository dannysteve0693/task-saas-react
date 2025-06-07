import React from 'react';

import { logo } from '@/assets';

const Logo = () => {
  return (
    <div className='flex items-center gap-3 text-lg font-semibold'>
      <img
        src={logo}
        alt='logo main page'
        className='w-6 h-6'
      />
      Tasky AI
    </div>
  );
};

export default Logo;
