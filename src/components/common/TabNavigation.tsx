// src/components/common/TabNavigation.tsx

'use client';

import { TabItem } from '@/hooks/useTab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type TabNavigationProps = {
  tabs: TabItem[];
  activeTab: string;
  paramKey?: string;
};

export const TabNavigation = ({
  tabs,
  activeTab,
  paramKey = 'tab',
}: TabNavigationProps) => {
  const searchParams = useSearchParams();

  return (
    <div className="sticky top-0 z-10 mt-3 flex w-full flex-col gap-1">
      <nav className="flex flex-col gap-2 space-y-4 text-sm font-medium text-gray-500">
        <ul className="grid w-full grid-cols-4 md:gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const newQuery = new URLSearchParams(searchParams.toString());
            newQuery.set(paramKey, tab.id);

            return (
              <li key={tab.id}>
                <Link
                  href={`?${paramKey}=${tab.id}`}
                  scroll={false}
                  replace
                  className={`galmuri flex inline-flex w-full flex-col items-center justify-center rounded-t-lg px-2 py-3 text-sm ${isActive ? 'bg-sky-500 text-white' : 'bg-gray-700/70 text-gray-300 hover:text-white'}`}
                >
                  {tab.icon && (
                    <FontAwesomeIcon
                      icon={tab.icon}
                      className={`text-lg md:text-base ${isActive ? `animate-bounce-short` : ``}`}
                    />
                  )}
                  <span
                    className={`text-xs md:text-sm ${isActive ? 'font-bold' : 'font-medium'}`}
                  >
                    {tab.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
