// T028: Sign in page without back-to-home button
import { Suspense } from 'react';

import SignInPageContent from './signin-content';

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
        </div>
      }
    >
      <SignInPageContent />
    </Suspense>
  );
}