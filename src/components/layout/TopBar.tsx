'use client';

import { BellIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';

export default function TopBar() {
  const user = useAuthStore((state) => state.user);

  // Get display name
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'PH Magutu';

  return (
    <header className="sticky top-0 z-30 bg-white rounded-tl-[2rem] px-8 py-5">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          {/* Notification Bell */}
          <button className="relative p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <BellIcon className="w-5 h-5" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2">
            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center border border-gray-200">
              {user?.user_metadata?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={user.user_metadata.avatar_url} 
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-blue-600 font-semibold text-xs">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            
            {/* Name and Dropdown */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-700">
                {displayName}
              </span>
              <ChevronDownIcon className="w-4 h-4 text-gray-400" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
