// T040: Dashboard layout with navigation bar and user menu

'use client';

import React from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-dark via-background-darker to-background-dark">
      {/* Navigation bar */}
      <nav className="bg-gradient-to-r from-primary-600 to-primary-500/80 border-b border-gray-800 shadow-xl backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-purple bg-clip-text text-transparent animate-text-gradient">
                ✨ Todo App
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {user && (
                <>
                  <span className="text-sm text-gray-700">{user.email}</span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
