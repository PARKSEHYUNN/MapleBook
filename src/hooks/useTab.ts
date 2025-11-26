// src/hooks/useTab.ts

'use client';

import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export type TabItem = {
  id: string;
  label: string;
  icon?: IconDefinition;
};

export const useTab = <T extends string>(
  tabs: TabItem[],
  defaultTabId: T,
  keyName: string = 'tab'
) => {
  const searchParams = useSearchParams();

  const activeTab = useMemo(() => {
    const currentParam = searchParams.get(keyName);
    const isValid = tabs.some((tab) => tab.id === currentParam);

    return (isValid ? currentParam : defaultTabId) as T;
  }, [searchParams, tabs, defaultTabId, keyName]);

  return { activeTab };
};
