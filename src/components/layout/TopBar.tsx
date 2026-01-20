'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-100 px-8 py-5">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-72 bg-gray-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Notification Bell */}
          <button className="relative p-2.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          {user && (
            <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">
                  {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
              <button className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-md hover:shadow-lg transition-shadow">
                {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
