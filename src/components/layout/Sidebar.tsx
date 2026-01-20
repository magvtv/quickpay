'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  BuildingOfficeIcon,
  GiftIcon,
  ScaleIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import type { ComponentType, SVGProps } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const mainNavItems: NavItem[] = [
  { name: 'HOME', href: '/dashboard', icon: HomeIcon },
  { name: 'COMPANY', href: '/company', icon: BuildingOfficeIcon },
  { name: 'PERKS', href: '/perks', icon: GiftIcon },
  { name: 'LEGAL', href: '/legal', icon: ScaleIcon },
  { name: 'PAYMENTS', href: '/payments', icon: CreditCardIcon },
];

const secondaryNavItems: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
  { name: 'Clients', href: '/clients', icon: UsersIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-[var(--primary-blue)] to-[var(--primary-dark)] text-white flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[var(--primary-blue)] font-bold text-xl">S</span>
          </div>
          <span className="font-semibold text-lg">StartGlobal</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'nav-item',
                isActive && 'nav-item-active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium tracking-wide">
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Secondary Navigation */}
        <div className="pt-6 space-y-1">
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'nav-item',
                  isActive && 'nav-item-active'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2 border-t border-white/10">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-all">
          <QuestionMarkCircleIcon className="w-5 h-5" />
          <span>GET HELP</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-all">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          <span>CHAT WITH US</span>
        </button>
      </div>
    </aside>
  );
}
