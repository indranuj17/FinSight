// app/sign-in/page.tsx (App Router)
import { SignIn } from '@clerk/nextjs';
import React from 'react';

export default function SignInPage() {
  return <SignIn path="/sign-in" routing="path" />;
}
