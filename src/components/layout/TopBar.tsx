'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const user = useAuthStore((state) => state.user);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title - Could be dynamic based on route */}
        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {user?.user_metadata?.full_name || 'Johnathan Doe'}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || 'john@example.com'}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
              {user?.user_metadata?.full_name?.[0] || 'J'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}