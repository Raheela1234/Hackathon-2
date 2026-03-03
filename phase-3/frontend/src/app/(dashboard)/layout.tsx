// T040: Dashboard layout with navigation bar and user menu

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation bar */}
        <nav className="bg-white/5 backdrop-blur-sm border-b border-white/10 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  ✨ Todo App
                </h1>

                {/* Navigation Links */}
                <div className="flex items-center gap-1">
                  <Link
                    href="/tasks"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/tasks'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    📋 Tasks
                  </Link>
                  <Link
                    href="/chat"
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === '/chat'
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    💬 Chat Assistant
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <span className="text-sm text-gray-300">{user.email}</span>
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
    </ProtectedRoute>
  );
}