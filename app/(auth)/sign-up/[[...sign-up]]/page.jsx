import { SignedOut, SignUp } from '@clerk/nextjs';
import React from 'react';

const Page = () => {
  return (
    <SignedOut>
      <SignUp />
    </SignedOut>
  );
};

export default Page;
