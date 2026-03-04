// T105: Landing page with branding and auth CTAs

import { Suspense } from 'react';
import LandingPageClient from './LandingPageClient';

export default function LandingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      }
    >
      <LandingPageClient />
    </Suspense>
  );
}
