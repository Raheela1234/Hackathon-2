// T027: Auth layout with centered card

import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      {/* Animated background blobs (purely visual) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70" />
      </div>

      {/* Grid pattern overlay matching LandingPageClient */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-primary-400 to-accent-purple bg-clip-text text-transparent mb-8">
          ✨ Todo App
        </h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-background-card border border-gray-800 py-8 px-4 shadow-card sm:rounded-2xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
